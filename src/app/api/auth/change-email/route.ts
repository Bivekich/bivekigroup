import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUser } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
    }

    const { newEmail, password } = await request.json();

    // Получаем текущий хеш пароля из базы
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [user.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(
      password,
      userResult.rows[0].password
    );

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Неверный пароль' }, { status: 400 });
    }

    // Проверяем, не занят ли новый email
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [newEmail, user.id]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { message: 'Этот email уже используется' },
        { status: 400 }
      );
    }

    // Обновляем email в базе
    await pool.query('UPDATE users SET email = $1 WHERE id = $2', [
      newEmail,
      user.id,
    ]);

    return NextResponse.json(
      { message: 'Email успешно изменен' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при смене email:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
