import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
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
    let query = 'SELECT * FROM websites';
    const values = [];

    // Если пользователь не админ, показываем только его сайты
    if (decoded.role !== 'admin') {
      query += ' WHERE client_id = $1';
      values.push(decoded.id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);

    return NextResponse.json({ websites: result.rows });
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
    const clientResult = await pool.query(
      'SELECT email FROM users WHERE id = $1 AND role = $2',
      [clientId, 'client']
    );

    if (clientResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Клиент не найден' },
        { status: 404 }
      );
    }

    const clientEmail = clientResult.rows[0].email;

    // Проверяем уникальность домена
    const domainExists = await pool.query(
      'SELECT id FROM websites WHERE domain = $1',
      [domain]
    );

    if (domainExists.rows.length > 0) {
      return NextResponse.json(
        { message: 'Сайт с таким доменом уже существует' },
        { status: 400 }
      );
    }

    // Создаем новый сайт
    const result = await pool.query(
      `INSERT INTO websites (name, domain, client_id, status, created_at, last_updated)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [name, domain, clientId, status]
    );

    // Отправляем уведомление клиенту
    try {
      await sendWebsiteCreatedEmail(clientEmail, {
        name,
        domain,
        status,
      });
    } catch (emailError) {
      console.error('Error sending website creation notification:', emailError);
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании сайта:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
