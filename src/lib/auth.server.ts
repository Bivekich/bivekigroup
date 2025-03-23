import { verify } from 'jsonwebtoken';
import { prisma } from './prisma';
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    };
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
