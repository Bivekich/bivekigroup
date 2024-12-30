import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

// Проверка роли администратора
async function isAdmin() {
  const token = cookies().get('token');
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

// Получение списка клиентов
export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    // Получаем параметр поиска из URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = 'SELECT id, email FROM users WHERE role = $1';
    const values = ['client'];

    // Если есть поисковый запрос, добавляем фильтрацию по email
    if (search) {
      query += ' AND email ILIKE $2';
      values.push(`%${search}%`);
    }

    query += ' ORDER BY email ASC';

    const result = await pool.query(query, values);

    return NextResponse.json({ clients: result.rows });
  } catch (error) {
    console.error('Ошибка при получении списка клиентов:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
