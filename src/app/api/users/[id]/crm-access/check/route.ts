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

// GET /api/users/[id]/crm-access/check - Проверить доступ пользователя к CRM
export async function GET(
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

    // Получаем ID пользователя из URL
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

    // Проверяем подписку
    const subscription = await prisma.cRMSubscription.findUnique({
      where: { user_id: userId },
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
    console.error('Ошибка при проверке доступа к CRM:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке доступа к CRM' },
      { status: 500 }
    );
  }
}
