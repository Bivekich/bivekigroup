import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendEmail } from '@/lib/mail';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Если админ - возвращаем все услуги, иначе только услуги пользователя
    const query =
      user.role === 'admin'
        ? `SELECT cs.*, u.email as user_email
         FROM cloud_services cs
         JOIN users u ON cs.user_id = u.id
         ORDER BY cs.created_at DESC`
        : `SELECT * FROM cloud_services
         WHERE user_id = $1
         ORDER BY created_at DESC`;

    const result = await pool.query(
      query,
      user.role === 'admin' ? [] : [user.id]
    );

    return NextResponse.json({ services: result.rows });
  } catch (error) {
    console.error('Ошибка при получении списка услуг:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { name, type, description, price, userId } = await req.json();

    // Получаем email клиента
    const clientResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (clientResult.rows.length === 0) {
      return new NextResponse('User not found', { status: 404 });
    }

    const clientEmail = clientResult.rows[0].email;

    // Создаем услугу
    const serviceResult = await pool.query(
      `INSERT INTO cloud_services
       (name, type, description, price, user_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'active', NOW())
       RETURNING *`,
      [name, type, description, price, userId]
    );

    const service = serviceResult.rows[0];

    // Отправляем email клиенту
    await sendEmail({
      to: clientEmail,
      subject: 'BivekiCloud',
      text: `Для вас была создана новая услуга: ${name}\n\nОписание: ${description}\nСтоимость: ${price} ₽/день`,
      html: `
        <h2>BivekiCloud!</h2>
        <p>Для вас была создана новая облачная услуга. Ниже приведены данные услуги:</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Название:</strong> ${name}</p>
          <p><strong>Тип:</strong> ${type}</p>
          <p><strong>Описание:</strong> ${description}</p>
          <p><strong>Стоимость:</strong> ${price} ₽/день</p>
        </div>
        <p>Для входа в систему перейдите по ссылке: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cloud" style="color: #007bff;">Войти</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
      `,
    });

    // Отправляем уведомление в Telegram админу
    const message = `
🆕 Создана новая облачная услуга
👤 Пользователь: ${clientEmail}
📦 Услуга: ${name}
💰 Стоимость: ${price} ₽/день
    `;

    await sendTelegramMessage(message);

    return NextResponse.json(service);
  } catch (error) {
    console.error('Ошибка при создании услуги:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { id, status, ...data } = await req.json();

    // Проверяем статус и устанавливаем значение по умолчанию, если не указан
    const validStatuses = ['active', 'suspended', 'terminated'];
    const serviceStatus =
      status && validStatuses.includes(status) ? status : 'active';

    // Обновляем услугу
    const serviceResult = await pool.query(
      `UPDATE cloud_services
       SET status = $1,
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [serviceStatus, data.name, data.description, data.price, id]
    );

    const service = serviceResult.rows[0];

    // Если услуга приостановлена, отправляем email клиенту
    if (status === 'suspended') {
      // Получаем email клиента
      const clientResult = await pool.query(
        'SELECT email FROM users WHERE id = $1',
        [service.user_id]
      );

      if (clientResult.rows.length > 0) {
        const clientEmail = clientResult.rows[0].email;

        await sendEmail({
          to: clientEmail,
          subject: 'Уведомление от BivekiGroup',
          text: `Услуга ${service.name} была приостановлена из-за недостаточного баланса`,
          from: `"BivekiGroup" <${process.env.SMTP_USER}>`,
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
      }

      // Отправляем уведомление в Telegram админу
      const message = `
⚠️ Приостановлена облачная услуга
👤 Пользователь: ${clientResult.rows[0]?.email}
📦 Услуга: ${service.name}
💰 Стоимость: ${service.price} ₽/день
💳 Текущий баланс: ${service.balance} ₽
      `;

      await sendTelegramMessage(message);
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Ошибка при обновлении услуги:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
