import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { sendTelegramMessage } from '@/lib/telegram';

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

    const result = await pool.query(
      `SELECT amount FROM cloud_balance WHERE user_id = $1`,
      [user.id]
    );

    return NextResponse.json({ balance: result.rows[0]?.amount || 0 });
  } catch (error) {
    console.error('Ошибка при получении баланса:', error);
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
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { amount, method } = await req.json();

    if (!amount || amount <= 0) {
      return new NextResponse('Invalid amount', { status: 400 });
    }

    // Создаем операцию пополнения
    const operationResult = await pool.query(
      `INSERT INTO cloud_operations
       (user_id, type, amount, method, status, created_at)
       VALUES ($1, 'deposit', $2, $3, $4, NOW())
       RETURNING *`,
      [user.id, amount, method, method === 'invoice' ? 'pending' : 'completed']
    );

    const operation = operationResult.rows[0];

    // Если оплата картой, сразу обновляем баланс
    if (method === 'online') {
      await pool.query(
        `INSERT INTO cloud_balance (user_id, amount)
         VALUES ($1, $2)
         ON CONFLICT (user_id)
         DO UPDATE SET amount = cloud_balance.amount + $2`,
        [user.id, amount]
      );

      // Отправляем уведомление в Telegram админу
      const message = `
💰 Пополнение баланса
👤 Пользователь: ${user.email}
💵 Сумма: ${amount} ₽
🔄 Метод: Оплата картой
      `;

      await sendTelegramMessage(message);
    } else {
      // Отправляем уведомление в Telegram админу о запросе счета
      const message = `
📋 Запрос на выставление счета
👤 Пользователь: ${user.email}
💵 Сумма: ${amount} ₽
      `;

      await sendTelegramMessage(message);
    }

    return NextResponse.json(operation);
  } catch (error) {
    console.error('Ошибка при пополнении баланса:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
