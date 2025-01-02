import { pool } from '@/lib/db';
import { checkIsAdmin } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const isAdmin = await checkIsAdmin(token);
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Недостаточно прав' },
        { status: 403 }
      );
    }

    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 RETURNING *',
      [context.params.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'Уведомление не найдено' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Уведомление удалено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
