import { cookies } from 'next/headers';
import { pool } from './db';
import { verify } from 'jsonwebtoken';
import { UserRole } from './types';

interface User {
  id: number;
  email: string;
  role: UserRole;
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const user = await verifyToken(token);
    return user;
  } catch {
    return null;
  }
}

async function verifyToken(token: string): Promise<User> {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || '') as {
      id: number;
    };

    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new Error('Пользователь не найден');
    }

    return result.rows[0];
  } catch {
    throw new Error('Ошибка аутентификации');
  }
}

export async function checkIsAdmin(token: string): Promise<boolean> {
  try {
    const user = await verifyToken(token);
    return user.role === 'admin';
  } catch {
    return false;
  }
}
