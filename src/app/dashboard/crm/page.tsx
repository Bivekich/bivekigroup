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
import InputMask from 'react-input-mask';
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
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface SubscriptionResponse {
  hasSubscription: boolean;
  isActive: boolean;
  subscription: CRMSubscription | null;
}

// Функция получения подписи для статуса
const getStatusLabel = (status: LeadStatus): string => {
  const statusLabels: Record<LeadStatus, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    waiting: 'В ожидании',
    completed: 'Выполнено',
    rejected: 'Отказ',
  };
  return statusLabels[status] || status;
};

// Функция форматирования суммы
const formatLeadAmount = (
  amount: string | number | null | undefined
): string => {
  if (amount === null || amount === undefined || amount === '') {
    return '0 ₽';
  }

  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return '0 ₽';
  }

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

// Компонент для колонки Канбан-доски
interface KanbanColumnProps {
  id: LeadStatus;
  title: string;
  count: number;
  amount: number;
  bgClass: string;
  countClass: string;
  children: React.ReactNode;
}

function KanbanColumn({
  id,
  title,
  count,
  amount,
  bgClass,
  countClass,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      className={`${bgClass} p-4 rounded-lg ${isOver ? 'ring-2 ring-primary' : ''}`}
    >
      <h3 className="font-medium mb-3 flex items-center justify-between">
        {title}{' '}
        <div className="flex items-center gap-1">
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
            {count}
          </span>
          <span className={`${countClass} px-2 py-0.5 rounded text-xs`}>
            {formatLeadAmount(amount)}
          </span>
        </div>
      </h3>
      <div className="space-y-2 min-h-[50px] pr-1" ref={setNodeRef}>
        {children}
      </div>
    </div>
  );
}

// Компонент для карточки лида
interface KanbanCardProps {
  lead: CRMLead;
  onOpen: (lead: CRMLead) => void;
}

function KanbanCard({ lead, onOpen }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `lead-${lead.id}`,
      data: { lead },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 20,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Card className="p-3 cursor-grab active:cursor-grabbing">
        <div className="text-sm font-medium">{lead.name}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(lead.created_at).toLocaleDateString('ru-RU')}
        </div>
        {lead.amount && (
          <div className="text-xs font-medium mt-2">
            {formatLeadAmount(lead.amount)}
          </div>
        )}
        <div className="flex justify-end mt-2 border-t pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(lead);
            }}
          >
            Открыть
          </Button>
        </div>
      </Card>
    </div>
  );
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
  const [statusCounts, setStatusCounts] = useState({
    new: 0,
    in_progress: 0,
    waiting: 0,
    completed: 0,
    rejected: 0,
  });
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

  // Пагинация
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  // Инициализация dnd-kit сенсоров
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<
    'basic' | 'website'
  >('basic');

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

  // Эффект для отслеживания изменений фильтров и пагинации
  useEffect(() => {
    if (subscription?.isActive) {
      fetchLeads();
    }
  }, [statusFilter, dateFilter, page, pageSize]);

  // Эффект для поиска с задержкой
  useEffect(() => {
    if (!subscription?.isActive) return;

    const timer = setTimeout(() => {
      fetchLeads();
    }, 300); // 300ms задержка после ввода

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

      // Добавляем параметры пагинации
      url += `page=${page}&pageSize=${pageSize}`;

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
      setTotalLeads(data.total);
      setTotalPages(Math.ceil(data.total / pageSize));
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
          subscriptionType: selectedSubscriptionType,
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

  // Открытие деталей лида
  const openLeadDetails = (lead: CRMLead) => {
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

  // Функция расчета суммы заявок по статусу
  const calculateStatusAmount = (status: LeadStatus): number => {
    return leads
      .filter((lead) => lead.status === status)
      .reduce((sum, lead) => {
        const amount = lead.amount ? parseFloat(String(lead.amount)) : 0;
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
  };

  // Функция обработки перетаскивания
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Если нет active или over элемента, значит перетаскивание не завершено
    if (!active || !over) return;

    // Получаем id лида из active.id (формат: "lead-123")
    const leadId = String(active.id).split('-')[1];

    // Получаем новый статус из id колонки over.id
    const newStatus = String(over.id) as LeadStatus;

    // Проверяем корректность данных
    if (!leadId || !newStatus) return;

    // Находим лид в текущем состоянии
    const leadToUpdate = leads.find((lead) => lead.id === parseInt(leadId));

    // Если лид не найден или его статус уже совпадает с целевым, не делаем ничего
    if (!leadToUpdate || leadToUpdate.status === newStatus) return;

    try {
      // Оптимистичное обновление UI
      const updatedLeads = leads.map((lead) =>
        lead.id === parseInt(leadId) ? { ...lead, status: newStatus } : lead
      );
      setLeads(updatedLeads);

      // Получаем токен авторизации
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      // Отправка запроса на сервер
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // В случае ошибки возвращаем предыдущее состояние
        setLeads(leads);
        toast({
          title: 'Ошибка обновления статуса',
          description: 'Не удалось обновить статус лида',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Статус обновлен',
          description: `Статус лида успешно изменен на "${getStatusLabel(newStatus)}"`,
        });
      }
    } catch (error: Error | unknown) {
      // В случае исключения возвращаем предыдущее состояние
      setLeads(leads);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при обновлении статуса',
        variant: 'destructive',
      });
      console.error('Ошибка обновления статуса:', error);
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
              Выберите тариф
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Базовый тариф */}
              <div
                className={`p-4 rounded-lg border bg-card relative cursor-pointer hover:border-primary/50 transition-colors ${selectedSubscriptionType === 'basic' ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => setSelectedSubscriptionType('basic')}
              >
                <h3 className="text-base font-medium">Базовый</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold">499₽</span>
                  <span className="text-sm text-muted-foreground">/месяц</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Базовый функционал CRM
                </p>
                <ul className="text-sm mt-4 space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Управление сделками и клиентами</li>
                  <li>Канбан-доска с Drag&Drop</li>
                  <li>Экспорт данных в Excel и CSV</li>
                  <li>Интуитивно понятный интерфейс</li>
                </ul>
              </div>

              {/* Тариф с интеграцией на сайт */}
              <div
                className={`p-4 rounded-lg border bg-card relative cursor-pointer hover:border-primary/50 transition-colors ${selectedSubscriptionType === 'website' ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => setSelectedSubscriptionType('website')}
              >
                <h3 className="text-base font-medium">С интеграцией на сайт</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold">999₽</span>
                  <span className="text-sm text-muted-foreground">/месяц</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Расширенный функционал CRM
                </p>
                <ul className="text-sm mt-4 space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Все возможности базового тарифа</li>
                  <li>Интеграция на ваш сайт (мы настроим)</li>
                  <li>Форма заявок для вашего сайта</li>
                  <li>Уведомления о новых заявках</li>
                </ul>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleSubscribe}>
              Оформить подписку
            </Button>
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
                    <div className={formErrors.phone ? 'border-red-500' : ''}>
                      <InputMask
                        mask="+7 (999) 999-99-99"
                        value={newLead.phone}
                        onChange={(e) =>
                          setNewLead({ ...newLead, phone: e.target.value })
                        }
                        placeholder="+7 (900) 123-45-67"
                      >
                        {(inputProps) => <Input {...inputProps} id="phone" />}
                      </InputMask>
                    </div>
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
        </div>

        <div className="flex gap-2 items-center">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <Select
            value={dateFilter}
            onValueChange={(value) => {
              setDateFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">За все время</SelectItem>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="yesterday">Вчера</SelectItem>
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="3months">За 3 месяца</SelectItem>
              <SelectItem value="6months">За 6 месяцев</SelectItem>
              <SelectItem value="12months">За 12 месяцев</SelectItem>
              <SelectItem value="custom">Свой период</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Статус-фильтры */}
      {view === 'table' && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('all');
              setPage(1);
            }}
          >
            Все ({leads.length})
          </Button>
          <Button
            variant={statusFilter === 'new' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('new');
              setPage(1);
            }}
          >
            Новые ({statusCounts.new || 0})
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('in_progress');
              setPage(1);
            }}
          >
            В работе ({statusCounts.in_progress || 0})
          </Button>
          <Button
            variant={statusFilter === 'waiting' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('waiting');
              setPage(1);
            }}
          >
            В ожидании ({statusCounts.waiting || 0})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('completed');
              setPage(1);
            }}
          >
            Выполнено ({statusCounts.completed || 0})
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('rejected');
              setPage(1);
            }}
          >
            Отказ ({statusCounts.rejected || 0})
          </Button>
        </div>
      )}

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
                          onClick={(e) => {
                            e.stopPropagation();
                            openLeadDetails(lead);
                          }}
                        >
                          Открыть
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Пагинация */}
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Показано {leads.length} из {totalLeads} заявок
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Предыдущая
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Логика для отображения нужных номеров страниц
                    let pageNumber = i + 1;
                    if (totalPages > 5 && page > 3) {
                      pageNumber = page - 3 + i;
                      if (pageNumber > totalPages) {
                        pageNumber = pageNumber - 5;
                      }
                    }

                    return (
                      <Button
                        key={i}
                        variant={pageNumber === page ? 'default' : 'outline'}
                        size="sm"
                        className="w-9 h-9 p-0"
                        onClick={() => setPage(pageNumber)}
                        disabled={pageNumber > totalPages}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Следующая
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Строк на странице:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1); // Сбрасываем на первую страницу
                  }}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Канбан-вид */}
      {view === 'kanban' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Колонка "Новые" */}
            <KanbanColumn
              id="new"
              title="Новые"
              count={leads.filter((lead) => lead.status === 'new').length}
              amount={calculateStatusAmount('new')}
              bgClass="bg-blue-100 text-blue-800"
              countClass="bg-blue-700 text-white"
            >
              {leads
                .filter((lead) => lead.status === 'new')
                .map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onOpen={openLeadDetails}
                  />
                ))}
            </KanbanColumn>

            {/* Колонка "В работе" */}
            <KanbanColumn
              id="in_progress"
              title="В работе"
              count={
                leads.filter((lead) => lead.status === 'in_progress').length
              }
              amount={calculateStatusAmount('in_progress')}
              bgClass="bg-yellow-100 text-yellow-800"
              countClass="bg-yellow-700 text-white"
            >
              {leads
                .filter((lead) => lead.status === 'in_progress')
                .map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onOpen={openLeadDetails}
                  />
                ))}
            </KanbanColumn>

            {/* Колонка "В ожидании" */}
            <KanbanColumn
              id="waiting"
              title="В ожидании"
              count={leads.filter((lead) => lead.status === 'waiting').length}
              amount={calculateStatusAmount('waiting')}
              bgClass="bg-purple-100 text-purple-800"
              countClass="bg-purple-700 text-white"
            >
              {leads
                .filter((lead) => lead.status === 'waiting')
                .map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onOpen={openLeadDetails}
                  />
                ))}
            </KanbanColumn>

            {/* Колонка "Выполнено" */}
            <KanbanColumn
              id="completed"
              title="Выполнено"
              count={leads.filter((lead) => lead.status === 'completed').length}
              amount={calculateStatusAmount('completed')}
              bgClass="bg-green-100 text-green-800"
              countClass="bg-green-700 text-white"
            >
              {leads
                .filter((lead) => lead.status === 'completed')
                .map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onOpen={openLeadDetails}
                  />
                ))}
            </KanbanColumn>

            {/* Колонка "Отказ" */}
            <KanbanColumn
              id="rejected"
              title="Отказ"
              count={leads.filter((lead) => lead.status === 'rejected').length}
              amount={calculateStatusAmount('rejected')}
              bgClass="bg-red-100 text-red-800"
              countClass="bg-red-700 text-white"
            >
              {leads
                .filter((lead) => lead.status === 'rejected')
                .map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onOpen={openLeadDetails}
                  />
                ))}
            </KanbanColumn>
          </div>
        </DndContext>
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
                  <div className={formErrors.phone ? 'border-red-500' : ''}>
                    <InputMask
                      mask="+7 (999) 999-99-99"
                      value={editLead.phone || ''}
                      onChange={(e) =>
                        setEditLead({ ...editLead, phone: e.target.value })
                      }
                      placeholder="+7 (900) 123-45-67"
                    >
                      {(inputProps) => (
                        <Input {...inputProps} id="edit-phone" />
                      )}
                    </InputMask>
                  </div>
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
                    value={
                      typeof editLead.amount === 'number'
                        ? String(editLead.amount)
                        : ''
                    }
                    onChange={(e) => {
                      const valueAsNumber =
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value);
                      setEditLead({
                        ...editLead,
                        amount: valueAsNumber,
                      });
                    }}
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
