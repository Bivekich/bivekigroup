import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { LeadStatus } from '@/lib/types';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

export async function POST(request: Request) {
  try {
    // Проверка авторизации
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Получаем данные запроса
    const { leadIds, status } = await request.json();

    // Проверяем валидность данных
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: 'Не указаны ID заявок' },
        { status: 400 }
      );
    }

    if (
      !status ||
      !['new', 'in_progress', 'waiting', 'completed', 'rejected'].includes(
        status
      )
    ) {
      return NextResponse.json({ error: 'Неверный статус' }, { status: 400 });
    }

    // Проверяем наличие подписки
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

    if (!subscription || !isActive) {
      return NextResponse.json(
        { error: 'Отсутствует активная подписка' },
        { status: 403 }
      );
    }

    // Обновляем статус для всех заявок пользователя из списка
    const updateResult = await prisma.cRMLead.updateMany({
      where: {
        id: {
          in: leadIds,
        },
        user_id: decoded.id,
      },
      data: {
        status: status as LeadStatus,
      },
    });

    return NextResponse.json({
      success: true,
      updatedCount: updateResult.count,
    });
  } catch (error) {
    console.error('Ошибка при массовом обновлении заявок:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
