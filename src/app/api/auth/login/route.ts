import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    // Получаем пользователя из базы данных
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true },
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    console.log('User found, role:', user.role);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Создаем JWT токен с информацией о роли
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    console.log('Token generated');

    // Создаем ответ с куками
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: token,
    });

    // Устанавливаем куки
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 1 день
      path: '/',
    });
    console.log('Cookie set');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе в систему' },
      { status: 500 }
    );
  }
}
