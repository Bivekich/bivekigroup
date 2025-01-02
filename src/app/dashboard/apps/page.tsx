'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Globe,
  Power,
  Trash2,
  Search,
  Settings,
  Construction,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../user-provider';
import { Website, WebsiteStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Client {
  id: number;
  email: string;
}

export default function AppsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [websiteSearchTerm, setWebsiteSearchTerm] = useState('');
  const [selectedClientFilter, setSelectedClientFilter] =
    useState<Client | null>(null);
  const [selectedEditClient, setSelectedEditClient] = useState<Client | null>(
    null
  );
  const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false);
  const [isEditClientPopoverOpen, setIsEditClientPopoverOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // Загрузка списка сайтов
  const loadWebsites = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const response = await fetch('/api/websites');
      if (!response.ok) throw new Error('Ошибка загрузки сайтов');
      const data = await response.json();
      setWebsites(data.websites);
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список сайтов',
        variant: 'destructive',
      });
    } finally {
      setIsPageLoading(false);
    }
  }, [toast]);

  // Загрузка списка клиентов
  const loadClients = useCallback(
    async (search?: string) => {
      try {
        const url = new URL('/api/clients', window.location.origin);
        if (search) {
          url.searchParams.set('search', search);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки клиентов');

        const data = await response.json();
        setClients(data.clients);
      } catch {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить список клиентов',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  // Загружаем сайты и клиентов при монтировании
  useEffect(() => {
    loadWebsites();
    loadClients();
  }, [loadWebsites, loadClients]);

  const handleAddWebsite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClient) {
      toast({
        title: 'Ошибка',
        description: 'Выберите клиента',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const websiteData = {
        name: formData.get('name') as string,
        domain: formData.get('domain') as string,
        clientId: selectedClient.id,
        status: formData.get('status') as WebsiteStatus,
      };

      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(websiteData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при создании сайта');
      }

      await loadWebsites(); // Перезагружаем список сайтов

      toast({
        title: 'Сайт добавлен',
        description: 'Новый сайт успешно добавлен в систему',
      });
      setIsAddDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Не удалось создать сайт',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    websiteId: number,
    status: WebsiteStatus
  ) => {
    if (user?.role !== 'admin') {
      toast({
        title: 'Ошибка',
        description: 'У вас нет прав для изменения статуса сайта',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при обновлении статуса');
      }

      await loadWebsites(); // Перезагружаем список сайтов

      toast({
        title: 'Статус обновлен',
        description: 'Статус сайта успешно изменен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось обновить статус сайта',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWebsite = async (websiteId: number) => {
    if (user?.role !== 'admin') {
      toast({
        title: 'Ошибка',
        description: 'У вас нет прав для удаления сайта',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить этот сайт?')) {
      return;
    }

    try {
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при удалении сайта');
      }

      await loadWebsites(); // Перезагружаем список сайтов

      toast({
        title: 'Сайт удален',
        description: 'Сайт успешно удален из системы',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Не удалось удалить сайт',
        variant: 'destructive',
      });
    }
  };

  const handleEditWebsite = (website: Website) => {
    setSelectedWebsite(website);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWebsite) return;

    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const websiteData = {
        name: formData.get('name') as string,
        domain: formData.get('domain') as string,
        status: formData.get('status') as WebsiteStatus,
        clientId: selectedEditClient?.id || selectedWebsite.client_id,
      };

      const response = await fetch(`/api/websites/${selectedWebsite.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(websiteData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при обновлении сайта');
      }

      toast({
        title: 'Успешно',
        description: 'Данные сайта обновлены',
      });

      setIsEditDialogOpen(false);
      loadWebsites();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Не удалось обновить сайт',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация сайтов
  const filteredWebsites = websites.filter((website) => {
    const matchesSearch =
      websiteSearchTerm === '' ||
      website.name.toLowerCase().includes(websiteSearchTerm.toLowerCase()) ||
      website.domain.toLowerCase().includes(websiteSearchTerm.toLowerCase());

    const matchesClient =
      !selectedClientFilter || website.client_id === selectedClientFilter.id;

    return matchesSearch && matchesClient;
  });

  useEffect(() => {
    if (selectedWebsite) {
      const client = clients.find((c) => c.id === selectedWebsite.client_id);
      setSelectedEditClient(client || null);
    }
  }, [selectedWebsite, clients]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === parseInt(clientId));
    setSelectedClient(client || null);
    setSearchTerm(''); // Очищаем поиск
    setIsClientPopoverOpen(false); // Закрываем попап после выбора
  };

  const handleEditClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === parseInt(clientId));
    setSelectedEditClient(client || null);
    setSearchTerm('');
    setIsEditClientPopoverOpen(false);
  };

  const handleFilterClientSelect = (client: Client | null) => {
    setSelectedClientFilter(client);
    setSearchTerm('');
    setIsFilterPopoverOpen(false);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Сайты</h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin'
              ? 'Управление всеми веб-проектами'
              : 'Ваши веб-проекты'}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          {user?.role === 'admin' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить сайт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый сайт</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о новом сайте
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddWebsite} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Клиент</Label>
                    <Popover
                      open={isClientPopoverOpen}
                      onOpenChange={setIsClientPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {selectedClient?.email || 'Выберите клиента'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <div className="p-2">
                          <Input
                            placeholder="Поиск клиента..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              loadClients(e.target.value);
                            }}
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {clients.map((client) => (
                            <button
                              key={client.id}
                              onClick={() =>
                                handleClientSelect(client.id.toString())
                              }
                              className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                            >
                              {client.email}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Название сайта</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      defaultValue={selectedWebsite?.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-domain">Домен</Label>
                    <Input
                      id="edit-domain"
                      name="domain"
                      defaultValue={selectedWebsite?.domain}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Статус</Label>
                    <Select
                      name="status"
                      defaultValue={selectedWebsite?.status}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">
                          В разработке
                        </SelectItem>
                        <SelectItem value="active">Активен</SelectItem>
                        <SelectItem value="suspended">Приостановлен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Поиск по названию или домену..."
              value={websiteSearchTerm}
              onChange={(e) => setWebsiteSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Popover
            open={isFilterPopoverOpen}
            onOpenChange={setIsFilterPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[200px] justify-between"
              >
                {selectedClientFilter
                  ? selectedClientFilter.email
                  : 'Все клиенты'}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <div className="p-2">
                <Input
                  placeholder="Поиск клиента..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    loadClients(e.target.value);
                  }}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                <button
                  onClick={() => handleFilterClientSelect(null)}
                  className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  Все клиенты
                </button>
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleFilterClientSelect(client)}
                    className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    {client.email}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {isPageLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredWebsites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center mb-2">
              Сайты не найдены
            </p>
            <p className="text-sm text-muted-foreground text-center">
              {websiteSearchTerm || selectedClientFilter
                ? 'Попробуйте изменить параметры поиска'
                : user?.role === 'admin'
                  ? 'Нажмите "Добавить сайт", чтобы создать новый'
                  : 'У вас пока нет сайтов в системе'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWebsites.map((website) => (
            <Card key={website.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {website.name}
                </CardTitle>
                {user?.role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditWebsite(website)}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="ml-2">Изменить</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {website.domain}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      website.status === 'active' &&
                        'bg-green-100 text-green-800',
                      website.status === 'development' &&
                        'bg-yellow-100 text-yellow-800',
                      website.status === 'suspended' &&
                        'bg-red-100 text-red-800'
                    )}
                  >
                    {website.status === 'active' && 'Активен'}
                    {website.status === 'development' && 'В разработке'}
                    {website.status === 'suspended' && 'Приостановлен'}
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-8',
                          website.status === 'active' && 'bg-green-100'
                        )}
                        onClick={() => handleStatusChange(website.id, 'active')}
                      >
                        <Power className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-8',
                          website.status === 'development' && 'bg-yellow-100'
                        )}
                        onClick={() =>
                          handleStatusChange(website.id, 'development')
                        }
                      >
                        <Construction className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-8',
                          website.status === 'suspended' && 'bg-red-100'
                        )}
                        onClick={() =>
                          handleStatusChange(website.id, 'suspended')
                        }
                      >
                        <Power className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => handleDeleteWebsite(website.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать сайт</DialogTitle>
            <DialogDescription>Измените информацию о сайте</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название сайта</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={selectedWebsite?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-domain">Домен</Label>
              <Input
                id="edit-domain"
                name="domain"
                defaultValue={selectedWebsite?.domain}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Клиент</Label>
              <Popover
                open={isEditClientPopoverOpen}
                onOpenChange={setIsEditClientPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedEditClient?.email ||
                      selectedWebsite?.client_email ||
                      'Выберите клиента'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="p-2">
                    <Input
                      placeholder="Поиск клиента..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        loadClients(e.target.value);
                      }}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() =>
                          handleEditClientSelect(client.id.toString())
                        }
                        className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                      >
                        {client.email}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Статус</Label>
              <Select
                name="status"
                defaultValue={selectedWebsite?.status || 'development'}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">В разработке</SelectItem>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="suspended">Приостановлен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
