import { NextResponse } from 'next/server';

const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID!;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;

async function createYookassaPayment(
  amount: number,
  email: string,
  successUrl: string
) {
  const idempotenceKey = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

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
      description: `Пополнение баланса на ${amount} ₽`,
      metadata: {
        email,
      },
    }),
  });

  if (!response.ok) {
    console.error('Yookassa error response:', await response.text());
    throw new Error('Ошибка при создании платежа в ЮKassa');
  }

  const data = await response.json();

  if (!data.confirmation?.confirmation_url) {
    console.error('Yookassa payment error:', data);
    throw new Error('Не получен URL для оплаты');
  }

  return data.confirmation.confirmation_url;
}

export async function POST(req: Request) {
  try {
    const { amount, type, email, successUrl } = await req.json();

    if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
      throw new Error('Не настроены учетные данные ЮKassa');
    }

    if (type === 'card') {
      const paymentUrl = await createYookassaPayment(amount, email, successUrl);

      return NextResponse.json({
        success: true,
        paymentUrl,
      });
    }

    return NextResponse.json(
      { error: 'Неподдерживаемый тип платежа' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
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
