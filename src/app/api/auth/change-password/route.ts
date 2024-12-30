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

    const { currentPassword, newPassword } = await request.json();

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

    // Проверяем текущий пароль
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Неверный текущий пароль' },
        { status: 400 }
      );
    }

    // Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Обновляем пароль в базе
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [
      hashedPassword,
      user.id,
    ]);

    return NextResponse.json(
      { message: 'Пароль успешно изменен' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при смене пароля:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
