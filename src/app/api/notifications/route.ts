import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin';

    // Получаем уведомления в зависимости от роли пользователя
    try {
      const notifications = await prisma.notification.findMany({
        where: isAdmin
          ? {}
          : {
              OR: [{ user_id: user.id }, { user_id: null }],
            },
        orderBy: { created_at: 'desc' },
      });

      return NextResponse.json(notifications);
    } catch (dbError) {
      console.error('Ошибка доступа к базе данных:', dbError);
      // В случае ошибки возвращаем пустой массив
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, description, userId } = await req.json();

    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        user_id: userId ? parseInt(userId) : null,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Ошибка при создании уведомления:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();

    await prisma.notification.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
