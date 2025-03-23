import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { sendWebsiteCreatedEmail } from '@/lib/mail';

// Проверка роли администратора
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return false;

  try {
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

// Получение списка сайтов
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { id: number; role: string };

    // Формируем запрос в зависимости от роли пользователя
    let websites;

    // Если пользователь не админ, показываем только его сайты
    if (decoded.role !== 'admin') {
      websites = await prisma.websites.findMany({
        where: {
          client_id: decoded.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } else {
      // Для админа показываем все сайты
      websites = await prisma.websites.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    return NextResponse.json({ websites });
  } catch (error) {
    console.error('Ошибка при получении списка сайтов:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Создание нового сайта
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { name, domain, clientId, status } = await request.json();

    // Получаем email клиента
    const client = await prisma.user.findUnique({
      where: {
        id: clientId,
        role: 'client',
      },
      select: {
        email: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Клиент не найден' },
        { status: 404 }
      );
    }

    // Проверяем уникальность домена
    const domainExists = await prisma.websites.findUnique({
      where: {
        domain,
      },
    });

    if (domainExists) {
      return NextResponse.json(
        { message: 'Сайт с таким доменом уже существует' },
        { status: 400 }
      );
    }

    // Создаем новый сайт
    const newWebsite = await prisma.websites.create({
      data: {
        name,
        domain,
        client_id: clientId,
        status,
        created_at: new Date(),
        last_updated: new Date(),
      },
    });

    // Отправляем уведомление клиенту
    try {
      await sendWebsiteCreatedEmail(client.email, {
        name,
        domain,
        status,
      });
    } catch (emailError) {
      console.error('Error sending website creation notification:', emailError);
    }

    return NextResponse.json(newWebsite);
  } catch (error) {
    console.error('Ошибка при создании сайта:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
