import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';

// Проверка роли администратора
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return false;
  }

  const user = await verifyAuthServer(token);
  return user?.role === 'admin';
}

// Получение списка клиентов
export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    // Получаем параметр поиска из URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const clients = await prisma.user.findMany({
      where: {
        role: 'client',
        ...(search && {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      select: {
        id: true,
        email: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Ошибка при получении списка клиентов:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
