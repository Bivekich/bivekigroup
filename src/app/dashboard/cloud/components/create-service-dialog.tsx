'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: number;
  email: string;
}

interface CreateServiceDialogProps {
  onServiceCreated: () => void;
}

export function CreateServiceDialog({
  onServiceCreated,
}: CreateServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Загружаем список клиентов при открытии диалога
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/users?role=client');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data.users);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить список клиентов',
          variant: 'destructive',
        });
      }
    };

    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const filteredClients = clients.filter((client) =>
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        type: formData.get('type'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        userId: parseInt(formData.get('userId') as string),
      };

      const response = await fetch('/api/cloud/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при создании услуги');
      }

      toast({
        title: 'Успешно',
        description: 'Услуга создана',
      });

      setIsOpen(false);
      onServiceCreated();
    } catch (error) {
      console.error('Ошибка при создании услуги:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Не удалось создать услугу',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Создать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать облачную услугу</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Клиент</label>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Поиск клиента..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select name="userId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input name="name" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Тип</label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="server">Сервер</SelectItem>
                <SelectItem value="database">База данных</SelectItem>
                <SelectItem value="storage">Хранилище</SelectItem>
                <SelectItem value="email">Почта</SelectItem>
                <SelectItem value="apps">Приложения</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea name="description" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Стоимость в день (₽)</label>
            <Input name="price" type="number" min="1" step="0.01" required />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Создание...' : 'Создать'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
