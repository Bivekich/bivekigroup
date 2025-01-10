import { UserRole } from './types';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

// Клиентская часть
export async function getUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const user = await getUser();
    return user?.role === 'admin';
  } catch {
    return false;
  }
}
