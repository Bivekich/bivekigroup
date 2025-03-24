'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Blocks,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Service {
  name: string;
  description: string;
  icon: LucideIcon;
  status: 'active' | 'development';
  href?: string;
  expectedDate?: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const services: Service[] = [
  {
    name: 'Сайты',
    description: 'Управление вашими сайтами и веб-проектами',
    icon: Blocks,
    status: 'active',
    href: '/dashboard/apps',
  },
  {
    name: 'Облачные услуги',
    description: 'Управление облачными сервисами и ресурсами',
    icon: Cloud,
    status: 'active',
    href: '/dashboard/cloud',
  },
  {
    name: 'Email рассылки',
    description: 'Система управления email-маркетингом',
    icon: Mail,
    status: 'development',
    expectedDate: 'Q3 2025',
  },
  {
    name: 'CRM система',
    description: 'Управление клиентами, сделками и проектами',
    icon: Users,
    status: 'development',
    expectedDate: 'Q4 2025',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotifications(data.slice(0, 2));
      } else {
        console.warn('Полученные уведомления не являются массивом:', data);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (href: string | undefined) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Обзор</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <Card
            key={service.name}
            className={cn(
              'transition-colors hover:border-primary/50',
              service.status === 'development' &&
                'border-yellow-500/20 bg-yellow-500/5'
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {service.name}
              </CardTitle>
              <service.icon
                className={cn(
                  'w-4 h-4',
                  service.status === 'development'
                    ? 'text-yellow-500'
                    : 'text-primary'
                )}
              />
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="text-sm text-muted-foreground">
                  {service.description}
                </div>
                <div className="flex items-center gap-2">
                  {service.status === 'active' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Доступно</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">
                        В разработке (ожидается: {service.expectedDate})
                      </span>
                    </>
                  )}
                </div>
                {service.status === 'active' && service.href && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigate(service.href)}
                  >
                    Открыть
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Системный статус</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Все системы работают нормально</span>
            </div>
            <div className="space-y-2 border-t pt-2">
              {services.map((service) => (
                <div key={service.name} className="flex items-center gap-2">
                  {service.status === 'active' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    {service.name} -{' '}
                    {service.status === 'active' ? 'работает' : 'в разработке'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 sm:space-y-0">
            <CardTitle className="text-lg">Последние уведомления</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="space-y-1 pb-3 last:pb-0 border-b last:border-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-sm">
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString('ru', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
