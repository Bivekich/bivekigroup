import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkSignature } from '@/lib/yookassa';

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
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.error('User not found:', userEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;
    const paymentAmount = parseFloat(amount.value);

    // Обновляем баланс пользователя
    await prisma.cloudBalance.upsert({
      where: { user_id: userId },
      update: {
        amount: { increment: paymentAmount },
      },
      create: {
        user_id: userId,
        amount: paymentAmount,
      },
    });

    // Создаем запись в истории операций
    await prisma.cloudOperation.create({
      data: {
        user_id: userId,
        type: 'deposit',
        amount: paymentAmount,
        method: 'online',
        status: 'completed',
      },
    });

    return NextResponse.json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
