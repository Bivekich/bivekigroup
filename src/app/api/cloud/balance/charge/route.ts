import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendEmail } from '@/lib/mail';

export async function POST() {
  try {
    // Получаем все активные услуги
    const activeServices = await db.query(
      `SELECT cs.*, u.email, cb.amount::numeric as balance, u.id as user_id
       FROM cloud_services cs
       JOIN users u ON cs.user_id = u.id
       JOIN cloud_balance cb ON cs.user_id = cb.user_id
       WHERE cs.status = 'active'
       ORDER BY u.id, cs.price DESC`
    );

    // Группируем услуги по пользователям
    const userServices = activeServices.rows.reduce((acc, service) => {
      if (!acc[service.user_id]) {
        acc[service.user_id] = {
          services: [],
          balance: parseFloat(service.balance),
          email: service.email,
        };
      }
      acc[service.user_id].services.push({
        ...service,
        price: parseFloat(service.price),
      });
      return acc;
    }, {});

    // Обрабатываем услуги для каждого пользователя
    for (const userId in userServices) {
      const { services, balance, email } = userServices[userId];
      let currentBalance = balance;
      let totalCharge = 0;

      console.log(`Проверка услуг для ${email}:`, {
        initialBalance: currentBalance,
        servicesCount: services.length,
      });

      // Проверяем все услуги пользователя
      for (const service of services) {
        try {
          if (currentBalance < service.price) {
            console.log(`Недостаточно средств для ${service.name}:`, {
              currentBalance,
              requiredPrice: service.price,
            });

            // Приостанавливаем услугу
            await db.query(
              'UPDATE cloud_services SET status = $1 WHERE id = $2',
              ['suspended', service.id]
            );

            // Отправляем уведомление
            await sendEmail({
              to: email,
              subject: 'Уведомление от BivekiGroup',
              text: `Услуга ${service.name} была приостановлена из-за недостаточного баланса`,
              from: `"Biveki Group" <${process.env.SMTP_USER}>`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333;">Уведомление о приостановке услуги</h2>
                  <p>Уведомляем вас о том, что облачная услуга была приостановлена.</p>
                  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Услуга:</strong> ${service.name}</p>
                    <p style="margin: 5px 0;"><strong>Причина:</strong> Недостаточно средств на балансе</p>
                  </div>
                  <p>Для возобновления работы услуги, пожалуйста, пополните баланс в <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cloud" style="color: #007bff;">личном кабинете</a>.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                </div>
              `,
            });

            await sendTelegramMessage(
              `⚠️ Приостановлена облачная услуга\n👤 Клиент: ${email}\n📦 Услуга: ${service.name}\n💰 Стоимость: ${service.price} ₽/день\n💳 Баланс: ${currentBalance} ₽`
            );
          } else {
            currentBalance -= service.price;
            totalCharge += service.price;

            await sendTelegramMessage(
              `💰 Списание средств\nКлиент: ${email}\nУслуга: ${service.name}\nСумма: ${service.price} ₽\nОстаток: ${currentBalance} ₽`
            );
          }
        } catch (error) {
          console.error(`Ошибка при обработке услуги ${service.name}:`, error);
          // Продолжаем обработку следующей услуги
          continue;
        }
      }

      // Если были списания, обновляем баланс
      if (totalCharge > 0) {
        const newBalance = balance - totalCharge;
        await db.query(
          'UPDATE cloud_balance SET amount = $1 WHERE user_id = $2',
          [newBalance, userId]
        );

        console.log(`Итоговое списание для ${email}:`, {
          totalCharge,
          newBalance,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при списании средств:', error);
    return NextResponse.json(
      { error: 'Ошибка при списании средств' },
      { status: 500 }
    );
  }
}
