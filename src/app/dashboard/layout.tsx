import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';
import { DashboardClient } from './dashboard-client';
import { Toaster } from '@/components/ui/toast';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token');

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    const user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return (
      <DashboardClient user={user}>
        {children}
        <Toaster />
      </DashboardClient>
    );
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    redirect('/login');
  }
}
