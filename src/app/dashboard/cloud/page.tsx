'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/use-user';
import { DepositDialog } from './components/deposit-dialog';
import { CreateServiceDialog } from './components/create-service-dialog';
import { BalanceDialog } from './components/balance-dialog';
import { EditServiceDialog } from './components/edit-service-dialog';
import {
  Settings,
  Power,
  Server,
  CreditCard,
  Trash2,
  ListFilter,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CloudTariffsModal } from '@/components/cloud-tariffs-modal';
import { useCloudTariffsModal } from '@/hooks/use-cloud-tariffs-modal';

interface CloudService {
  id: number;
  name: string;
  type: 'server' | 'database' | 'storage' | 'email' | 'apps';
  description: string;
  price: number;
  status: string;
  user_id: number;
  user_email: string;
}

export default function CloudPage() {
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState<CloudService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<CloudService | null>(
    null
  );
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<CloudService | null>(
    null
  );
  const { user } = useUser();
  const { isOpen, open, close } = useCloudTariffsModal();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [balanceRes, servicesRes] = await Promise.all([
        fetch('/api/cloud/balance'),
        fetch('/api/cloud/services'),
      ]);

      console.log('Balance response status:', balanceRes.status);
      console.log('Services response status:', servicesRes.status);

      if (!balanceRes.ok) {
        const errorText = await balanceRes.text();
        console.error('Balance API error:', errorText);
        throw new Error('Ошибка при получении данных баланса');
      }

      if (!servicesRes.ok) {
        const errorText = await servicesRes.text();
        console.error('Services API error:', errorText);
        throw new Error('Ошибка при получении данных услуг');
      }

      const balanceData = await balanceRes.json();
      const servicesData = await servicesRes.json();

      console.log('Balance data:', balanceData);
      console.log('Services data:', servicesData);

      setBalance(balanceData?.balance || 0);
      setServices(servicesData?.services || []);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
      setBalance(0);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Получаем дату следующего списания (сегодня в 23:59)
  const getNextChargeDate = () => {
    const now = new Date();
    const nextCharge = new Date(now);
    nextCharge.setHours(23, 59, 0, 0);
    return nextCharge.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'suspended':
        return 'text-yellow-500';
      case 'terminated':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'suspended':
        return 'Приостановлен';
      case 'terminated':
        return 'Отключен';
      default:
        return status;
    }
  };

  const handleServiceClick = (service: CloudService) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleBalanceClick = (service: CloudService) => {
    setSelectedService(service);
    setIsBalanceDialogOpen(true);
  };

  const handleStatusToggle = async (service: CloudService) => {
    try {
      const newStatus = service.status === 'active' ? 'suspended' : 'active';
      const response = await fetch('/api/cloud/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса услуги');
      }

      toast({
        title: 'Успешно',
        description: `Услуга ${newStatus === 'active' ? 'активирована' : 'приостановлена'}`,
      });

      fetchData();
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус услуги',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (service: CloudService) => {
    try {
      const response = await fetch(`/api/cloud/services/${service.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении услуги');
      }

      toast({
        title: 'Успешно',
        description: 'Услуга удалена',
      });

      setServiceToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить услугу',
        variant: 'destructive',
      });
    }
  };

  if (!user || isLoading) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Облачные услуги</h1>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button variant="outline" className="gap-2" onClick={open}>
            <ListFilter className="h-4 w-4" />
            Тарифы
          </Button>
          {user?.role === 'admin' ? (
            <CreateServiceDialog onServiceCreated={fetchData} />
          ) : (
            <DepositDialog onDeposit={fetchData} />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Баланс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance !== undefined ? balance.toLocaleString('ru-RU') : '0'} ₽
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Следующее списание: {getNextChargeDate()}
            </p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-lg font-semibold mb-4">Мои услуги</h2>
          <div className="grid gap-4">
            {services.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                {user?.role === 'admin'
                  ? 'Нет созданных услуг'
                  : 'У вас пока нет облачных услуг'}
              </div>
            ) : (
              services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Server className="h-5 w-5 text-blue-500 mt-1" />
                        <div className="space-y-1">
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                          {user?.role === 'admin' && (
                            <p className="text-sm text-muted-foreground">
                              Клиент: {service.user_email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-medium">
                            {service.price.toLocaleString('ru-RU')} ₽/день
                          </div>
                          <div
                            className={`text-sm ${getStatusColor(service.status)}`}
                          >
                            {getStatusText(service.status)}
                          </div>
                        </div>
                        {user?.role === 'admin' && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleServiceClick(service)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleBalanceClick(service)}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusToggle(service)}
                              className={
                                service.status === 'active'
                                  ? 'text-red-500'
                                  : 'text-green-500'
                              }
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setServiceToDelete(service)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedService && (
        <>
          <BalanceDialog
            isOpen={isBalanceDialogOpen}
            onClose={() => {
              setIsBalanceDialogOpen(false);
              setSelectedService(null);
            }}
            userId={selectedService.user_id.toString()}
            userEmail={selectedService.user_email}
            onBalanceUpdated={fetchData}
          />
          <EditServiceDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
            onServiceUpdated={fetchData}
          />
        </>
      )}

      <AlertDialog
        open={!!serviceToDelete}
        onOpenChange={() => setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить услугу?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Услуга будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => serviceToDelete && handleDelete(serviceToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CloudTariffsModal isOpen={isOpen} onClose={close} />
    </>
  );
}
