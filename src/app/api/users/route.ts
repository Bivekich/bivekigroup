import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/mail';
import { verifyAuthServer } from '@/lib/auth.server';

// Вспомогательная функция для проверки админских прав
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return false;
  }

  const user = await verifyAuthServer(token);
  return user?.role === 'admin';
}

export async function POST(req: Request) {
  try {
    // Проверяем права администратора
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        {
          error:
            'Доступ запрещен. Только администраторы могут создавать пользователей',
        },
        { status: 403 }
      );
    }

    const { email, password, role } = await req.json();

    // Валидация роли
    if (!role || !['admin', 'client'].includes(role)) {
      return NextResponse.json(
        {
          error:
            'Недопустимое значение роли. Допустимые значения: admin, client',
        },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await hash(password, 10);

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Отправляем приветственное письмо
    try {
      await sendWelcomeEmail(email, password);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Продолжаем выполнение даже если письмо не отправилось
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('GET /api/users called');
  const isAdminUser = await isAdmin();
  console.log('Is admin:', isAdminUser);

  if (!isAdminUser) {
    return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    console.log('Users found:', users.length);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка пользователей' },
      { status: 500 }
    );
  }
}
