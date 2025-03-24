'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');

        if (!res.ok) {
          console.error('Ошибка авторизации:', res.status);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const user = await res.json();
        if (user && user.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
        <p className="text-muted-foreground">
          У вас нет прав для просмотра этой страницы
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
