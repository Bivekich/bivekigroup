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
  ChevronDown,
  User,
  LogOut,
  Home,
  Cloud,
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
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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
        badge: 'Q2 2025',
      },
      {
        title: 'Email рассылки',
        href: '/dashboard/email',
        icon: Mail,
        badge: 'Q3 2025',
      },
      {
        title: 'CRM система',
        href: '/dashboard/crm',
        icon: LayoutGrid,
        badge: 'Q4 2025',
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        {/* Десктопная боковая панель */}
        <aside
          className={cn(
            'hidden md:flex fixed top-0 left-0 h-screen border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
            isSidebarOpen ? 'w-64' : 'w-20'
          )}
        >
          <div className="flex flex-col w-full">
            <div className="h-16 flex items-center px-6 border-b border-border">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Collapsible open={isSidebarOpen}>
                  <CollapsibleContent className="transition-all duration-300">
                    <span className="font-bold text-xl">Biveki Group</span>
                  </CollapsibleContent>
                </Collapsible>
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
                    <Collapsible open={isSidebarOpen}>
                      <CollapsibleContent className="transition-all duration-300">
                        <h2 className="px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          {group.title}
                        </h2>
                      </CollapsibleContent>
                    </Collapsible>
                    <div className="space-y-1">
                      {filteredItems.map((item) => (
                        <Button
                          key={item.title}
                          variant={
                            pathname === item.href ? 'secondary' : 'ghost'
                          }
                          className={cn(
                            'w-full transition-all duration-300',
                            isSidebarOpen
                              ? 'justify-start px-4'
                              : 'justify-center px-0'
                          )}
                          onClick={() => router.push(item.href)}
                        >
                          <item.icon
                            className={cn('h-4 w-4', isSidebarOpen && 'mr-2')}
                          />
                          <Collapsible open={isSidebarOpen}>
                            <CollapsibleContent className="transition-all duration-300">
                              {item.title}
                            </CollapsibleContent>
                          </Collapsible>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Мобильная навигация */}
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <div className="h-16 flex items-center px-6 border-b border-border">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <SheetTitle className="font-bold text-xl">
                  Biveki Group
                </SheetTitle>
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
                          className="w-full justify-start"
                          onClick={() => {
                            router.push(item.href);
                            setIsMobileNavOpen(false);
                          }}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Основной контент */}
        <div
          className={cn(
            'flex-1 transition-all duration-300',
            isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
          )}
        >
          {/* Верхняя панель */}
          <header
            className={cn(
              'fixed top-0 right-0 left-0 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 transition-all duration-300',
              isSidebarOpen ? 'md:left-64' : 'md:left-20'
            )}
          >
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileNavOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Уведомления</p>
                        <p className="text-xs text-muted-foreground">
                          Последние обновления системы
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 text-sm border-b last:border-0"
                          >
                            <div className="flex flex-col mb-1">
                              <span className="font-medium">
                                {notification.title}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  notification.created_at
                                ).toLocaleString('ru', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          Нет новых уведомлений
                        </div>
                      )}
                    </div>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start whitespace-nowrap"
                          onClick={() =>
                            router.push('/dashboard/notifications')
                          }
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Уведомления
                        </Button>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      {user?.role === 'admin' && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-blue-500 font-medium">
                            Администратор
                          </span>
                        </div>
                      )}
                      <span className="max-w-[200px] truncate">
                        {user?.email}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Профиль
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => (window.location.href = '/')}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Вернуться на сайт
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Выход
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Контент страницы */}
          <main className="pt-16 p-6">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
