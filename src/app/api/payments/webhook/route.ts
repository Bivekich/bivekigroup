import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendBalanceUpdateEmail } from '@/lib/mail';
import crypto from 'crypto';

const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;

// Функция для проверки подписи от ЮKassa
function checkSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha1', YOOKASSA_SECRET_KEY);
  const expectedSignature = hmac.update(body).digest('hex');

  return signature === expectedSignature;
}

export async function POST(req: Request) {
  try {
    // Получаем тело запроса в формате строки для проверки подписи
    const body = await req.text();
    const data = JSON.parse(body);

    // Получаем подпись из заголовков
    const signature = req.headers.get('yookassa-signature');

    // Проверяем подпись
    if (!checkSignature(body, signature)) {
      console.error('Invalid signature from YooKassa');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Проверяем, что это уведомление о успешной оплате
    if (data.event !== 'payment.succeeded') {
      return NextResponse.json({ message: 'Ignored non-success event' });
    }

    const { metadata, amount } = data.object;
    const userEmail = metadata.email;

    // Получаем пользователя по email
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [userEmail]
    );

    if (userResult.rows.length === 0) {
      console.error('User not found:', userEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;
    const paymentAmount = parseFloat(amount.value);

    // Обновляем баланс пользователя
    await pool.query(
      `INSERT INTO cloud_balance (user_id, amount)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET amount = cloud_balance.amount + $2`,
      [userId, paymentAmount]
    );

    // Создаем запись в истории операций
    await pool.query(
      `INSERT INTO cloud_operations
       (user_id, type, amount, method, status)
       VALUES ($1, 'deposit', $2, 'online', 'completed')`,
      [userId, paymentAmount]
    );

    // Получаем обновленный баланс
    const balanceResult = await pool.query(
      'SELECT amount FROM cloud_balance WHERE user_id = $1',
      [userId]
    );

    const newBalance = balanceResult.rows[0].amount;

    // Отправляем уведомление в Telegram
    await sendTelegramMessage(
      `💰 Успешное пополнение баланса\n👤 Пользователь: ${userEmail}\n💵 Сумма: ${paymentAmount} ₽\n💳 Новый баланс: ${newBalance} ₽`
    );

    // Отправляем email пользователю
    await sendBalanceUpdateEmail(userEmail, {
      amount: paymentAmount,
      newBalance,
      type: 'deposit',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing YooKassa webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
