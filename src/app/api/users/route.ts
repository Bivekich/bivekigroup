import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { hash } from 'bcrypt';
import { sendWelcomeEmail } from '@/lib/mail';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

// Проверка роли администратора
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  console.log('Token present:', !!token);
  if (!token) return false;

  try {
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { role: string };
    console.log('Decoded role:', decoded.role);
    return decoded.role === 'admin';
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    // Проверяем, существует ли пользователь
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await hash(password, 10);

    // Создаем пользователя
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );

    // Отправляем приветственное письмо
    try {
      await sendWelcomeEmail(email, password);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Продолжаем выполнение даже если письмо не отправилось
    }

    return NextResponse.json(result.rows[0]);
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
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users'
    );
    console.log('Users found:', result.rows.length);
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка пользователей' },
      { status: 500 }
    );
  }
}
