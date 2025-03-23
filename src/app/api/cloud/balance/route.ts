import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';

async function isAdmin(token: string) {
  try {
    const user = await verifyAuthServer(token);
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * GET /api/cloud/balance
 * Получение баланса пользователя
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const isAdminUser = await isAdmin(token);

    // Для админов возвращаем все балансы пользователей
    if (isAdminUser) {
      const usersWithBalances = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          cloudBalance: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return NextResponse.json(usersWithBalances);
    }

    // Для обычных пользователей возвращаем только их баланс
    const userWithBalance = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        cloudBalance: true,
      },
    });

    if (!userWithBalance) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      balance: userWithBalance.cloudBalance?.amount || 0,
    });
  } catch (error) {
    console.error('Ошибка при получении баланса', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cloud/balance
 * Изменение баланса пользователя (только для админов)
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const isAdminUser = await isAdmin(token);
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    const { userId, amount, description } = await request.json();

    // Проверка наличия обязательных полей
    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    // Проверка существования пользователя
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Обновляем или создаем баланс пользователя
    await prisma.cloudBalance.upsert({
      where: {
        user_id: parseInt(userId),
      },
      update: {
        amount: {
          increment: parseFloat(amount),
        },
      },
      create: {
        user_id: parseInt(userId),
        amount: parseFloat(amount),
      },
    });

    // Получаем обновленные данные пользователя с балансом
    const updatedUser = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        id: true,
        email: true,
        cloudBalance: true,
      },
    });

    // Создаем запись в истории операций
    await prisma.cloudOperation.create({
      data: {
        user_id: parseInt(userId),
        amount: parseFloat(amount),
        status: 'completed',
        type: amount > 0 ? 'deposit' : 'withdrawal',
        method: description || 'Изменение баланса администратором',
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Ошибка при изменении баланса', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
