import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

interface JWTPayload {
  id: number;
  role: string;
}

// Проверка на админа
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return false;

  try {
    const payload = verify(token.value, process.env.JWT_SECRET!) as JWTPayload;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

// POST /api/users/[id]/crm-access - Выдать бесплатный доступ к CRM
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем права администратора
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора' },
        { status: 403 }
      );
    }

    // Получаем данные из запроса
    const { duration = 30 } = await req.json();
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Некорректный ID пользователя' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем существующую подписку
    const existingSubscription = await prisma.cRMSubscription.findUnique({
      where: { user_id: userId },
    });

    let subscription;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    if (existingSubscription) {
      // Обновляем существующую подписку
      subscription = await prisma.cRMSubscription.update({
        where: { user_id: userId },
        data: {
          active: true,
          expires_at: expiresAt,
        },
      });
    } else {
      // Создаем новую подписку
      subscription = await prisma.cRMSubscription.create({
        data: {
          user_id: userId,
          active: true,
          expires_at: expiresAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Бесплатный доступ к CRM выдан пользователю ${user.email}`,
      subscription,
    });
  } catch (error) {
    console.error('Ошибка при выдаче доступа к CRM:', error);
    return NextResponse.json(
      { error: 'Ошибка при выдаче доступа к CRM' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]/crm-access - Удалить доступ к CRM
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем права администратора
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора' },
        { status: 403 }
      );
    }

    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Некорректный ID пользователя' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем существующую подписку
    const existingSubscription = await prisma.cRMSubscription.findUnique({
      where: { user_id: userId },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Подписка CRM не найдена' },
        { status: 404 }
      );
    }

    // Удаляем подписку
    await prisma.cRMSubscription.delete({
      where: { user_id: userId },
    });

    return NextResponse.json({
      success: true,
      message: `Доступ к CRM отозван у пользователя ${user.email}`,
    });
  } catch (error) {
    console.error('Ошибка при удалении доступа к CRM:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении доступа к CRM' },
      { status: 500 }
    );
  }
}
