import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAuthServer } from '@/lib/auth.server';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Недостаточно прав' },
        { status: 403 }
      );
    }

    const notification = await prisma.notification.delete({
      where: { id: parseInt(context.params.id) },
    });

    if (!notification) {
      return NextResponse.json(
        { message: 'Уведомление не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Уведомление удалено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
