import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendBalanceUpdateEmail } from '@/lib/mail';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    const result = await pool.query(
      `SELECT amount FROM cloud_balance WHERE user_id = $1`,
      [params.userId]
    );

    return NextResponse.json({ balance: result.rows[0]?.amount || 0 });
  } catch (error) {
    console.error('Ошибка при получении баланса:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    const { amount } = await request.json();

    // Получаем email пользователя
    const userResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [params.userId]
    );

    if (userResult.rows.length === 0) {
      return new NextResponse('User not found', { status: 404 });
    }

    const userEmail = userResult.rows[0].email;

    // Получаем текущий баланс
    const currentBalanceResult = await pool.query(
      'SELECT amount FROM cloud_balance WHERE user_id = $1',
      [params.userId]
    );

    const currentBalance = Number(currentBalanceResult.rows[0]?.amount || 0);
    const newBalance = Number(currentBalance + amount);

    // Обновляем баланс
    await pool.query(
      `INSERT INTO cloud_balance (user_id, amount)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET amount = $2`,
      [params.userId, newBalance]
    );

    // Создаем запись в истории операций
    await pool.query(
      `INSERT INTO cloud_operations
       (user_id, type, amount, status)
       VALUES ($1, $2, $3, 'completed')`,
      [params.userId, amount >= 0 ? 'deposit' : 'withdrawal', Math.abs(amount)]
    );

    // Отправляем уведомление в Telegram
    const message = `
💰 ${amount >= 0 ? 'Пополнение' : 'Списание'} баланса
👤 Пользователь: ${userEmail}
💵 Сумма: ${Number(Math.abs(amount)).toFixed(2)} ₽
💳 Новый баланс: ${newBalance.toFixed(2)} ₽
    `;

    await sendTelegramMessage(message);

    // Отправляем уведомление на почту
    await sendBalanceUpdateEmail(userEmail, {
      amount: Number(amount),
      newBalance,
      type: amount >= 0 ? 'deposit' : 'withdrawal',
    });

    return NextResponse.json({ balance: newBalance });
  } catch (error) {
    console.error('Ошибка при обновлении баланса:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
