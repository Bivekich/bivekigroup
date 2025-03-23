'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CreditCard,
  FileDown,
  Plus,
  List,
  KanbanSquare,
  Search,
  CalendarRange,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CRMLead, CRMSubscription, LeadStatus } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionResponse {
  hasSubscription: boolean;
  isActive: boolean;
  subscription: CRMSubscription | null;
}

export default function CRMPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(
    null
  );
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isLeadDetailsOpen, setIsLeadDetailsOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editLead, setEditLead] = useState<CRMLead | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  // Фильтры и поиск
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Состояния для диалогов
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    status: 'new' as LeadStatus,
    comment: '',
  });
  const [exportEmail, setExportEmail] = useState('');
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [exportDateFrom, setExportDateFrom] = useState('');
  const [exportDateTo, setExportDateTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');

        if (userEmail) {
          setExportEmail(userEmail);
        }

        if (!token) {
          router.push('/login');
          return;
        }

        // Получаем информацию о дате создания аккаунта
        try {
          const accountResponse = await fetch('/api/account', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (accountResponse.ok) {
            const accountData = await accountResponse.json();
            if (accountData.created_at) {
              setUserCreatedAt(accountData.created_at);
            }
          }
        } catch (error) {
          console.error('Ошибка при получении данных аккаунта:', error);
        }

        const response = await fetch('/api/crm/subscription', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при проверке подписки');
        }

        const data = await response.json();
        setSubscription(data);

        // Если email не нашелся в localStorage, запросим данные профиля
        if (!userEmail) {
          try {
            const profileResponse = await fetch('/api/profile', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.email) {
                setExportEmail(profileData.email);
                localStorage.setItem('userEmail', profileData.email);
              }
            }
          } catch (error) {
            console.error('Ошибка при получении профиля:', error);
          }
        }

        // Если есть активная подписка, загружаем заявки
        if (data.isActive) {
          await fetchLeads();
        }
      } catch (error) {
        console.error('Ошибка:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные о подписке',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [router, toast]);

  // Функция для получения заявок с учетом фильтров
  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      let url = '/api/crm/leads?';

      // Добавляем фильтры в URL
      if (statusFilter !== 'all') {
        url += `status=${statusFilter}&`;
      }

      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }

      // Добавляем фильтр по дате
      const { dateFrom, dateTo } = getDateRange(dateFilter);
      if (dateFrom) {
        url += `dateFrom=${dateFrom.toISOString()}&`;
      }
      if (dateTo) {
        url += `dateTo=${dateTo.toISOString()}&`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении заявок');
      }

      const data = await response.json();
      setLeads(data.leads);
      setStatusCounts(data.statusStats);
    } catch (error) {
      console.error('Ошибка:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive',
      });
    }
  };

  // Функция для получения диапазона дат на основе выбранного фильтра
  const getDateRange = (
    dateFilterValue: string
  ): { dateFrom: Date | null; dateTo: Date | null } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilterValue) {
      case 'today':
        return { dateFrom: today, dateTo: now };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { dateFrom: yesterday, dateTo: today };
      }
      case 'week': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { dateFrom: weekAgo, dateTo: now };
      }
      case 'month': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { dateFrom: monthAgo, dateTo: now };
      }
      case '3months': {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return { dateFrom: threeMonthsAgo, dateTo: now };
      }
      case '6months': {
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return { dateFrom: sixMonthsAgo, dateTo: now };
      }
      case '12months': {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return { dateFrom: yearAgo, dateTo: now };
      }
      case 'custom':
        // Для пользовательского диапазона, пока вернем null
        // В реальном приложении здесь будут значения из дейтпикеров
        return { dateFrom: null, dateTo: null };
      case 'all':
      default:
        return { dateFrom: null, dateTo: null };
    }
  };

  // Функция покупки подписки
  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/crm/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/dashboard/crm`,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании платежа');
      }

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать платеж',
        variant: 'destructive',
      });
    }
  };

  // Функция проверки валидности Email
  const isValidEmail = (email: string) => {
    return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Функция проверки валидности телефона
  const isValidPhone = (phone: string) => {
    return (
      phone === '' ||
      /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/.test(
        phone
      )
    );
  };

  // Функция добавления новой заявки
  const handleAddLead = async () => {
    try {
      // Проверка валидности формы
      const errors: {
        name?: string;
        phone?: string;
        email?: string;
      } = {};

      if (!newLead.name || newLead.name.trim() === '') {
        errors.name = 'Имя клиента обязательно';
      }

      if (newLead.phone && !isValidPhone(newLead.phone)) {
        errors.phone = 'Неверный формат номера телефона';
      }

      if (newLead.email && !isValidEmail(newLead.email)) {
        errors.email = 'Неверный формат Email';
      }

      // Если есть ошибки, показываем их и прерываем отправку
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLead),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании заявки');
      }

      // Сбрасываем форму и закрываем диалог
      setNewLead({
        name: '',
        phone: '',
        email: '',
        amount: '',
        status: 'new',
        comment: '',
      });
      setIsAddLeadOpen(false);

      // Обновляем список заявок
      await fetchLeads();

      toast({
        title: 'Успешно',
        description: 'Заявка успешно создана',
      });
    } catch (error) {
      console.error('Ошибка при создании заявки:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заявку',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция экспорта данных
  const handleExportData = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      // Проверка заполнения формы
      if (!exportEmail || !exportDateFrom || !exportDateTo) {
        toast({
          title: 'Ошибка',
          description: 'Заполните все обязательные поля',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/crm/leads/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: exportEmail,
          format: exportFormat,
          dateFrom: exportDateFrom,
          dateTo: exportDateTo,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при экспорте данных');
      }

      // Сохраняем email пользователя
      localStorage.setItem('userEmail', exportEmail);

      // Сбрасываем форму и закрываем диалог
      setExportFormat('xlsx');
      setExportDateFrom('');
      setExportDateTo('');
      setIsExportOpen(false);

      toast({
        title: 'Успешно',
        description: 'Данные будут отправлены на указанный email',
      });
    } catch (error) {
      console.error('Ошибка при экспорте данных:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать данные',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция открытия детальной информации о заявке
  const handleOpenLead = (lead: CRMLead) => {
    setSelectedLead(lead);
    setIsLeadDetailsOpen(true);
  };

  // Функция открытия формы редактирования заявки
  const handleEditLead = () => {
    if (selectedLead) {
      setEditLead({ ...selectedLead });
      setIsEditLeadOpen(true);
      setIsLeadDetailsOpen(false);
    }
  };

  // Функция открытия диалога удаления заявки
  const handleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
    setIsLeadDetailsOpen(false);
  };

  // Функция сохранения отредактированной заявки
  const handleSaveEdit = async () => {
    try {
      if (!editLead) return;

      // Проверка валидности формы
      const errors: {
        name?: string;
        phone?: string;
        email?: string;
      } = {};

      if (!editLead.name || editLead.name.trim() === '') {
        errors.name = 'Имя клиента обязательно';
      }

      if (editLead.phone && !isValidPhone(editLead.phone)) {
        errors.phone = 'Неверный формат номера телефона';
      }

      if (editLead.email && !isValidEmail(editLead.email)) {
        errors.email = 'Неверный формат Email';
      }

      // Если есть ошибки, показываем их и прерываем отправку
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/crm/leads/${editLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editLead),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении заявки');
      }

      setIsEditLeadOpen(false);
      await fetchLeads();

      toast({
        title: 'Успешно',
        description: 'Заявка успешно обновлена',
      });
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить заявку',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция удаления заявки
  const handleDeleteLead = async () => {
    try {
      if (!selectedLead) return;

      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении заявки');
      }

      setIsDeleteConfirmOpen(false);
      await fetchLeads();

      toast({
        title: 'Успешно',
        description: 'Заявка успешно удалена',
      });
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если загрузка или нет данных о подписке
  if (loading || !subscription) {
    return (
      <div className="container max-w-6xl py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">CRM система</h1>
        </div>

        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Если нет активной подписки, показываем информацию о покупке
  if (!subscription.isActive) {
    return (
      <div className="container max-w-3xl py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">CRM система</h1>
        </div>

        <Card>
          <CardHeader className="space-y-1 sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              Управление заявками и клиентами
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">
              CRM система позволит вам эффективно управлять заявками,
              отслеживать статусы и взаимодействовать с клиентами.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-medium">
                  Основные функции
                </h3>
                <ul className="text-sm sm:text-base list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Управление заявками</li>
                  <li>Канбан-доска</li>
                  <li>Экспорт данных</li>
                  <li>Отслеживание статусов</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-medium">
                  Преимущества
                </h3>
                <ul className="text-sm sm:text-base list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Простой интерфейс</li>
                  <li>Быстрый доступ к данным</li>
                  <li>Удобная фильтрация</li>
                  <li>Поддержка 24/7</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="space-y-1 sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Оформить подписку
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="text-base font-medium">CRM система</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold">1150₽</span>
                <span className="text-sm text-muted-foreground">/месяц</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Полный доступ ко всем функциям CRM
              </p>
              <Button className="w-full mt-4" onClick={handleSubscribe}>
                Оформить подписку
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Основной интерфейс CRM с активной подпиской
  return (
    <div className="container max-w-6xl py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">CRM система</h1>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isExportOpen}
            onOpenChange={(open) => {
              setIsExportOpen(open);
              if (open) {
                // При открытии диалога устанавливаем текущую дату для поля "по"
                const today = new Date().toISOString().split('T')[0];
                setExportDateTo(today);

                // Устанавливаем дату "с" на месяц назад, но не раньше даты создания аккаунта
                let lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                // Проверяем дату создания аккаунта
                if (userCreatedAt) {
                  const createdDate = new Date(userCreatedAt);
                  if (lastMonth < createdDate) {
                    lastMonth = createdDate;
                  }
                }

                setExportDateFrom(lastMonth.toISOString().split('T')[0]);

                // Берем email из локального хранилища
                const savedEmail = localStorage.getItem('userEmail');
                if (savedEmail) {
                  setExportEmail(savedEmail);
                }
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <FileDown className="h-4 w-4 mr-2" />
                Выгрузить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Экспорт данных</DialogTitle>
                <DialogDescription>
                  Заполните форму для экспорта заявок
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exportEmail">
                    Email для получения данных
                  </Label>
                  <Input
                    id="exportEmail"
                    value={exportEmail}
                    onChange={(e) => setExportEmail(e.target.value)}
                    type="email"
                    placeholder="example@mail.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Формат файла</Label>
                  <Select
                    value={exportFormat}
                    onValueChange={(value: 'xlsx' | 'csv') =>
                      setExportFormat(value)
                    }
                  >
                    <SelectTrigger id="exportFormat">
                      <SelectValue placeholder="Выберите формат" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exportDateFrom">Дата с</Label>
                    <Input
                      id="exportDateFrom"
                      type="date"
                      value={exportDateFrom}
                      onChange={(e) => setExportDateFrom(e.target.value)}
                      min={
                        userCreatedAt ? userCreatedAt.split('T')[0] : undefined
                      }
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exportDateTo">Дата по</Label>
                    <Input
                      id="exportDateTo"
                      type="date"
                      value={exportDateTo}
                      onChange={(e) => setExportDateTo(e.target.value)}
                      min={
                        exportDateFrom ||
                        (userCreatedAt
                          ? userCreatedAt.split('T')[0]
                          : undefined)
                      }
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsExportOpen(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleExportData} disabled={isSubmitting}>
                  {isSubmitting ? 'Экспорт...' : 'Экспортировать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Добавить заявку
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая заявка</DialogTitle>
                <DialogDescription>
                  Заполните форму для создания новой заявки
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя клиента *</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                    placeholder="Иван Иванов"
                    required
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={newLead.phone}
                      onChange={(e) =>
                        setNewLead({ ...newLead, phone: e.target.value })
                      }
                      placeholder="+7 (900) 123-45-67"
                      className={formErrors.phone ? 'border-red-500' : ''}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={newLead.email}
                      onChange={(e) =>
                        setNewLead({ ...newLead, email: e.target.value })
                      }
                      type="email"
                      placeholder="example@mail.com"
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Сумма</Label>
                    <Input
                      id="amount"
                      value={newLead.amount}
                      onChange={(e) =>
                        setNewLead({ ...newLead, amount: e.target.value })
                      }
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={newLead.status}
                      onValueChange={(value: LeadStatus) =>
                        setNewLead({ ...newLead, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Новый</SelectItem>
                        <SelectItem value="in_progress">В работе</SelectItem>
                        <SelectItem value="waiting">В ожидании</SelectItem>
                        <SelectItem value="completed">Выполнен</SelectItem>
                        <SelectItem value="rejected">Отказ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea
                    id="comment"
                    value={newLead.comment}
                    onChange={(e) =>
                      setNewLead({ ...newLead, comment: e.target.value })
                    }
                    placeholder="Дополнительная информация"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddLeadOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleAddLead}
                  disabled={isSubmitting || !newLead.name}
                >
                  {isSubmitting ? 'Создание...' : 'Создать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Панель фильтров и поиска */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex gap-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            <List className="h-4 w-4 mr-2" />
            Таблица
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            <KanbanSquare className="h-4 w-4 mr-2" />
            Канбан
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative grow">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchLeads}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <select
            className="bg-background text-sm border rounded px-2 py-1 w-full"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">За все время</option>
            <option value="today">Сегодня</option>
            <option value="yesterday">Вчера</option>
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
            <option value="3months">За 3 месяца</option>
            <option value="6months">За 6 месяцев</option>
            <option value="12months">За 12 месяцев</option>
            <option value="custom">Свой период</option>
          </select>
        </div>
      </div>

      {/* Статус-фильтры */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          Все ({leads.length})
        </Button>
        <Button
          variant={statusFilter === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('new')}
        >
          Новые ({statusCounts.new || 0})
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('in_progress')}
        >
          В работе ({statusCounts.in_progress || 0})
        </Button>
        <Button
          variant={statusFilter === 'waiting' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('waiting')}
        >
          В ожидании ({statusCounts.waiting || 0})
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('completed')}
        >
          Выполнено ({statusCounts.completed || 0})
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('rejected')}
        >
          Отказ ({statusCounts.rejected || 0})
        </Button>
      </div>

      {/* Табличный вид */}
      {view === 'table' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="h-4 w-4" />
                  </TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Номер</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <input type="checkbox" className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <span
                          className={`
                          px-2 py-1 rounded-full text-xs
                          ${lead.status === 'new' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : ''}
                          ${lead.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : ''}
                          ${lead.status === 'waiting' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : ''}
                          ${lead.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : ''}
                          ${lead.status === 'rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : ''}
                        `}
                        >
                          {lead.status === 'new' && 'Новый'}
                          {lead.status === 'in_progress' && 'В работе'}
                          {lead.status === 'waiting' && 'В ожидании'}
                          {lead.status === 'completed' && 'Выполнен'}
                          {lead.status === 'rejected' && 'Отказ'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>#{lead.id}</TableCell>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.phone || '-'}</TableCell>
                      <TableCell>{lead.email || '-'}</TableCell>
                      <TableCell>
                        {lead.amount ? `${lead.amount} ₽` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenLead(lead)}
                        >
                          Открыть
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Канбан-вид */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center justify-between">
              Новые{' '}
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                {statusCounts.new || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {leads
                .filter((lead) => lead.status === 'new')
                .map((lead) => (
                  <Card key={lead.id} className="p-3">
                    <div className="text-sm font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    {lead.amount && (
                      <div className="text-xs font-medium mt-2">
                        {lead.amount} ₽
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center justify-between">
              В работе{' '}
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded text-xs">
                {statusCounts.in_progress || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {leads
                .filter((lead) => lead.status === 'in_progress')
                .map((lead) => (
                  <Card key={lead.id} className="p-3">
                    <div className="text-sm font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    {lead.amount && (
                      <div className="text-xs font-medium mt-2">
                        {lead.amount} ₽
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center justify-between">
              В ожидании{' '}
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded text-xs">
                {statusCounts.waiting || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {leads
                .filter((lead) => lead.status === 'waiting')
                .map((lead) => (
                  <Card key={lead.id} className="p-3">
                    <div className="text-sm font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    {lead.amount && (
                      <div className="text-xs font-medium mt-2">
                        {lead.amount} ₽
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center justify-between">
              Выполнено{' '}
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-xs">
                {statusCounts.completed || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {leads
                .filter((lead) => lead.status === 'completed')
                .map((lead) => (
                  <Card key={lead.id} className="p-3">
                    <div className="text-sm font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    {lead.amount && (
                      <div className="text-xs font-medium mt-2">
                        {lead.amount} ₽
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center justify-between">
              Отказ{' '}
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded text-xs">
                {statusCounts.rejected || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {leads
                .filter((lead) => lead.status === 'rejected')
                .map((lead) => (
                  <Card key={lead.id} className="p-3">
                    <div className="text-sm font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    {lead.amount && (
                      <div className="text-xs font-medium mt-2">
                        {lead.amount} ₽
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Диалог с детальной информацией о заявке */}
      <Dialog open={isLeadDetailsOpen} onOpenChange={setIsLeadDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Заявка #{selectedLead?.id}</DialogTitle>
            <DialogDescription>Детальная информация о заявке</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Статус
                  </h4>
                  <p className="mt-1">
                    <span
                      className={`
                      px-2 py-1 rounded-full text-xs
                      ${selectedLead.status === 'new' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : ''}
                      ${selectedLead.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : ''}
                      ${selectedLead.status === 'waiting' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : ''}
                      ${selectedLead.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : ''}
                      ${selectedLead.status === 'rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : ''}
                    `}
                    >
                      {selectedLead.status === 'new' && 'Новый'}
                      {selectedLead.status === 'in_progress' && 'В работе'}
                      {selectedLead.status === 'waiting' && 'В ожидании'}
                      {selectedLead.status === 'completed' && 'Выполнен'}
                      {selectedLead.status === 'rejected' && 'Отказ'}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Дата создания
                  </h4>
                  <p className="mt-1">
                    {new Date(selectedLead.created_at).toLocaleDateString(
                      'ru-RU'
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Клиент
                </h4>
                <p className="mt-1 font-medium">{selectedLead.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Телефон
                  </h4>
                  <p className="mt-1">{selectedLead.phone || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h4>
                  <p className="mt-1">{selectedLead.email || '-'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Сумма
                </h4>
                <p className="mt-1">
                  {selectedLead.amount ? `${selectedLead.amount} ₽` : '-'}
                </p>
              </div>

              {selectedLead.comment && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Комментарий
                  </h4>
                  <p className="mt-1 text-sm">{selectedLead.comment}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsLeadDetailsOpen(false)}
            >
              Закрыть
            </Button>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                size="sm"
              >
                Удалить
              </Button>
              <Button onClick={handleEditLead} size="sm">
                Редактировать
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования заявки */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование заявки #{editLead?.id}</DialogTitle>
            <DialogDescription>Измените данные заявки</DialogDescription>
          </DialogHeader>
          {editLead && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Имя клиента *</Label>
                <Input
                  id="edit-name"
                  value={editLead.name}
                  onChange={(e) =>
                    setEditLead({ ...editLead, name: e.target.value })
                  }
                  placeholder="Иван Иванов"
                  className={formErrors.name ? 'border-red-500' : ''}
                  required
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Телефон</Label>
                  <Input
                    id="edit-phone"
                    value={editLead.phone || ''}
                    onChange={(e) =>
                      setEditLead({ ...editLead, phone: e.target.value })
                    }
                    placeholder="+7 (900) 123-45-67"
                    className={formErrors.phone ? 'border-red-500' : ''}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editLead.email || ''}
                    onChange={(e) =>
                      setEditLead({ ...editLead, email: e.target.value })
                    }
                    type="email"
                    placeholder="example@mail.com"
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Сумма</Label>
                  <Input
                    id="edit-amount"
                    value={editLead.amount || ''}
                    onChange={(e) =>
                      setEditLead({ ...editLead, amount: e.target.value })
                    }
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Статус</Label>
                  <Select
                    value={editLead.status}
                    onValueChange={(value: LeadStatus) =>
                      setEditLead({ ...editLead, status: value })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="in_progress">В работе</SelectItem>
                      <SelectItem value="waiting">В ожидании</SelectItem>
                      <SelectItem value="completed">Выполнен</SelectItem>
                      <SelectItem value="rejected">Отказ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-comment">Комментарий</Label>
                <Textarea
                  id="edit-comment"
                  value={editLead.comment || ''}
                  onChange={(e) =>
                    setEditLead({ ...editLead, comment: e.target.value })
                  }
                  placeholder="Дополнительная информация"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLeadOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удаление заявки</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить заявку #{selectedLead?.id}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Это действие нельзя отменить. Заявка будет безвозвратно удалена из
              системы.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLead}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
