import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkIsAdmin } from '@/lib/auth';
import { pool } from '@/lib/db';
import { sendEmail } from '@/lib/mail';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, title, description, created_at FROM notifications ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error);
    return new NextResponse('Внутренняя ошибка сервера', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const isAdmin = await checkIsAdmin(token.value);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    // Создаем уведомление
    const result = await pool.query(
      'INSERT INTO notifications (title, description) VALUES ($1, $2) RETURNING id, title, description, created_at',
      [title, description]
    );

    // Получаем всех пользователей
    const users = await pool.query('SELECT email FROM users');

    // Отправляем email каждому пользователю
    for (const user of users.rows) {
      try {
        await sendEmail({
          to: user.email,
          subject: `Новое уведомление: ${title}`,
          html: `
            <h2>${title}</h2>
            <p>${description}</p>
            <hr />
            <p>С уважением,<br>Команда Biveki Group</p>
          `,
          from: `"Biveki Group" <${process.env.SMTP_USER}>`,
        });
      } catch (emailError) {
        console.error(`Ошибка отправки email для ${user.email}:`, emailError);
      }
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании уведомления:', error);
    return new NextResponse('Внутренняя ошибка сервера', { status: 500 });
  }
}
