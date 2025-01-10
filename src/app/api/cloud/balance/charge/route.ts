import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST() {
  try {
    // Получаем все активные услуги
    const activeServices = await db.query(
      `SELECT cs.*, u.email, u.balance
       FROM cloud_services cs
       JOIN users u ON cs.user_id = u.id
       WHERE cs.status = 'active'`
    );

    for (const service of activeServices.rows) {
      const { user_id, price, email, balance } = service;

      // Проверяем достаточно ли средств
      if (balance < price) {
        // Если средств недостаточно, приостанавливаем услугу
        await db.query('UPDATE cloud_services SET status = $1 WHERE id = $2', [
          'suspended',
          service.id,
        ]);

        // Отправляем уведомление
        await sendTelegramMessage(
          `❌ Услуга ${service.name} приостановлена\nКлиент: ${email}\nПричина: недостаточно средств`
        );

        continue;
      }

      // Списываем средства
      const newBalance = balance - price;
      await db.query('UPDATE users SET balance = $1 WHERE id = $2', [
        newBalance,
        user_id,
      ]);

      // Отправляем уведомление о списании
      await sendTelegramMessage(
        `💰 Списание средств\nКлиент: ${email}\nУслуга: ${service.name}\nСумма: ${price} ₽\nНовый баланс: ${newBalance} ₽`
      );
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
