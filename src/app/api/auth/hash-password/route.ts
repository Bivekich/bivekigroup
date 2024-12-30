import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Обновляем пароль в базе данных
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [
      hashedPassword,
      email,
    ]);

    return NextResponse.json(
      { message: 'Пароль успешно обновлен' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
