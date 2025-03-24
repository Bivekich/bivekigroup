import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID!;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

async function createYookassaPayment(
  amount: number,
  email: string,
  successUrl: string,
  description: string
) {
  const idempotenceKey = `CRM-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': idempotenceKey,
      Authorization: `Basic ${Buffer.from(
        `${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`
      ).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: successUrl,
      },
      description: description,
      metadata: {
        email,
        payment_type: 'crm_subscription',
      },
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
    }),
  });

  if (!response.ok) {
    console.error('Ошибка ЮKassa:', await response.text());
    throw new Error('Ошибка при создании платежа в ЮKassa');
  }

  const data = await response.json();

  if (!data.confirmation?.confirmation_url) {
    console.error('Ошибка платежа ЮKassa:', data);
    throw new Error('Не получен URL для оплаты');
  }

  return data.confirmation.confirmation_url;
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];
    const { successUrl, subscriptionType = 'basic' } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
      throw new Error('Не настроены учетные данные ЮKassa');
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Стоимость подписки в зависимости от типа
    let amount = 499; // Базовая подписка
    let description = 'CRM система';

    if (subscriptionType === 'website') {
      amount = 999; // Подписка с интеграцией на сайт
      description = 'CRM система с интеграцией на сайт';
    }

    const paymentUrl = await createYookassaPayment(
      amount,
      decoded.email,
      successUrl,
      description
    );

    return NextResponse.json({
      success: true,
      paymentUrl,
    });
  } catch (error) {
    console.error('Ошибка при создании платежа CRM:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Ошибка при создании платежа',
      },
      { status: 500 }
    );
  }
}
