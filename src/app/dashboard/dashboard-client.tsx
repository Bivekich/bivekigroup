'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  Mail,
  HelpCircle,
  Shield,
  Globe,
  LayoutGrid,
  Menu,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  Home,
  Cloud,
  Laptop,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { UserProvider } from './user-provider';
import { UserRole } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Основное',
    items: [
      {
        title: 'Главная',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: 'Сайты',
        href: '/dashboard/apps',
        icon: Globe,
      },
      {
        title: 'Помощь',
        href: '/dashboard/help',
        icon: HelpCircle,
      },
    ],
  },
  {
    title: 'Администрирование',
    items: [
      {
        title: 'Пользователи',
        href: '/dashboard/users',
        icon: Users,
        adminOnly: true,
      },
      {
        title: 'Уведомления',
        href: '/dashboard/notifications',
        icon: Bell,
        adminOnly: true,
      },
    ],
  },
  {
    title: 'В разработке',
    items: [
      {
        title: 'Облачные услуги',
        href: '/dashboard/cloud',
        icon: Cloud,
      },
      {
        title: 'Email рассылки',
        href: '/dashboard/email',
        icon: Mail,
      },
      {
        title: 'CRM система',
        href: '/dashboard/crm',
        icon: LayoutGrid,
      },
    ],
  },
];

interface Notification {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface DashboardClientProps {
  children: React.ReactNode;
  user: {
    email: string;
    id: number;
    role: UserRole;
  };
}

export function DashboardClient({ children, user }: DashboardClientProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Ошибка при выходе');
      }

      window.location.href = '/login';
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось выйти из системы',
        variant: 'destructive',
      });
    }
  };

  return (
    <UserProvider initialUser={user}>
      <div className="flex min-h-screen">
        {/* Десктопный сайдбар */}
        <aside className="hidden md:flex w-64 border-r bg-background">
          <div className="flex flex-col h-full w-full">
            <div className="h-16 flex items-center px-6 border-b">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="font-bold text-xl">Biveki Group</span>
                {user?.role === 'admin' && (
                  <Shield className="h-4 w-4 text-blue-500" />
                )}
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto space-y-4 px-2 py-4">
              {navigation.map((group) => {
                const filteredItems = group.items.filter(
                  (item) => !item.adminOnly || user?.role === 'admin'
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={group.title} className="space-y-4">
                    <h2 className="px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {group.title}
                    </h2>
                    <div className="space-y-1">
                      {filteredItems.map((item) => (
                        <Button
                          key={item.title}
                          variant={
                            pathname === item.href ? 'secondary' : 'ghost'
                          }
                          className="w-full justify-start px-4"
                          onClick={() => router.push(item.href)}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Мобильный сайдбар */}
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetContent
            side="left"
            className="w-[300px] p-0 border-r [&>button]:hidden"
          >
            <SheetTitle className="sr-only">Навигационное меню</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center justify-between px-6 border-b">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="font-bold text-xl">Biveki Group</span>
                  {user?.role === 'admin' && (
                    <Shield className="h-4 w-4 text-blue-500" />
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-accent"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Закрыть меню</span>
                </Button>
              </div>
              <nav className="flex-1 overflow-y-auto py-6">
                {navigation.map((group) => {
                  const filteredItems = group.items.filter(
                    (item) => !item.adminOnly || user?.role === 'admin'
                  );

                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={group.title} className="mb-6 px-4">
                      <h2 className="mb-4 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {group.title}
                      </h2>
                      <div className="space-y-1">
                        {filteredItems.map((item) => (
                          <Button
                            key={item.title}
                            variant={
                              pathname === item.href ? 'secondary' : 'ghost'
                            }
                            className="w-full justify-start px-4 h-11"
                            onClick={() => {
                              router.push(item.href);
                              setIsMobileNavOpen(false);
                            }}
                          >
                            <item.icon className="mr-3 h-5 w-5" />
                            <span className="text-sm">{item.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsMobileNavOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {mounted && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {theme === 'light' ? (
                              <Sun className="h-5 w-5" />
                            ) : theme === 'dark' ? (
                              <Moon className="h-5 w-5" />
                            ) : (
                              <Sun className="h-5 w-5" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setTheme('light')}>
                            <Sun className="mr-2 h-4 w-4" />
                            Светлая
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme('dark')}>
                            <Moon className="mr-2 h-4 w-4" />
                            Тёмная
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme('system')}>
                            <Laptop className="mr-2 h-4 w-4" />
                            Системная
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                          >
                            <Bell className="h-5 w-5" />
                            {notifications.length > 0 && (
                              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                          <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              Нет новых уведомлений
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-1 p-4"
                              >
                                <div className="font-medium">
                                  {notification.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {notification.description}
                                </div>
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2"
                          >
                            <User className="h-5 w-5" />
                            <div className="hidden sm:flex items-center gap-1">
                              <span>{user.email}</span>
                              {user?.role === 'admin' && (
                                <Shield className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard/profile"
                              className="flex items-center"
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>Профиль</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/" className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              <span>Вернуться на сайт</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-500 focus:text-red-500"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Выйти</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
