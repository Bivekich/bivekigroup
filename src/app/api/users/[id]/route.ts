import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';
import { sendAccountUpdateEmail, sendAccountDeleteEmail } from '@/lib/mail';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

// Проверка на админа
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return false;

  try {
    const payload = verify(token.value, process.env.JWT_SECRET!) as JWTPayload;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

// Обновление пользователя
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = parseInt(params.id);
    const { email, password, role } = await request.json();

    // Получаем текущие данные пользователя
    const currentUser = await pool.query(
      'SELECT email, role FROM users WHERE id = $1',
      [userId]
    );

    if (currentUser.rows.length === 0) {
      return new NextResponse('User not found', { status: 404 });
    }

    const oldEmail = currentUser.rows[0].email;
    const oldRole = currentUser.rows[0].role;

    // Если указан новый email, проверяем его уникальность
    if (email && email !== oldEmail) {
      const emailExists = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailExists.rows.length > 0) {
        return new NextResponse('Email already exists', { status: 409 });
      }
    }

    // Формируем запрос на обновление
    let query = 'UPDATE users SET';
    const values = [];
    const updates = [];
    let paramCount = 1;

    const changes: { email?: string; role?: string; password?: string } = {};

    if (email && email !== oldEmail) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
      changes.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
      changes.password = password;
    }

    if (role && role !== oldRole) {
      updates.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
      changes.role = role;
    }

    if (updates.length === 0) {
      return new NextResponse('No data to update', { status: 400 });
    }

    query += ` ${updates.join(', ')} WHERE id = $${paramCount}`;
    values.push(userId);

    // Выполняем обновление
    await pool.query(query, values);

    // Получаем обновленные данные пользователя
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    // Отправляем уведомление на почту
    if (Object.keys(changes).length > 0) {
      try {
        console.log(
          'Sending update notification to:',
          oldEmail,
          'Changes:',
          changes
        );
        await sendAccountUpdateEmail(oldEmail, changes);
      } catch (emailError) {
        console.error('Error sending update notification:', emailError);
      }
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Удаление пользователя
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = parseInt(params.id);

    // Получаем email пользователя перед удалением
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [
      userId,
    ]);

    if (user.rows.length === 0) {
      return new NextResponse('User not found', { status: 404 });
    }

    const userEmail = user.rows[0].email;

    // Удаляем пользователя
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    // Отправляем уведомление на почту
    try {
      await sendAccountDeleteEmail(userEmail);
    } catch (emailError) {
      console.error('Error sending deletion notification:', emailError);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
