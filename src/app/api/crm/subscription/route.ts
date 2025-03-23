import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Получаем подписку пользователя
    const subscription = await prisma.cRMSubscription.findUnique({
      where: {
        user_id: decoded.id,
      },
    });

    // Проверяем активность подписки
    const isActive =
      subscription?.active &&
      (!subscription.expires_at ||
        new Date(subscription.expires_at) > new Date());

    return NextResponse.json({
      hasSubscription: !!subscription,
      isActive: !!isActive,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Ошибка при проверке подписки на CRM:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке подписки на CRM' },
      { status: 500 }
    );
  }
}
