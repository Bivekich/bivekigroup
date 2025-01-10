import { verify } from 'jsonwebtoken';
import { pool } from './db';
import { UserRole } from './types';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export async function verifyAuthServer(token: string): Promise<User | null> {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: UserRole;
    };

    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function checkIsAdminServer(token: string): Promise<boolean> {
  try {
    const user = await verifyAuthServer(token);
    return user?.role === 'admin';
  } catch {
    return false;
  }
}
