'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from '@/components/ui/use-toast';

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

interface EditServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: CloudService;
  onServiceUpdated: () => void;
}

export function EditServiceDialog({
  isOpen,
  onClose,
  service,
  onServiceUpdated,
}: EditServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(service.name);
  const [type, setType] = useState(service.type);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price.toString());

  const handleSubmit = async () => {
    if (!name || !type || !description || !price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/cloud/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name,
          type,
          description,
          price: parseFloat(price),
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении услуги');
      }

      toast({
        title: 'Успешно',
        description: 'Услуга обновлена',
      });

      onClose();
      onServiceUpdated();
    } catch (error) {
      console.error('Ошибка при обновлении услуги:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить услугу',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать услугу</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Клиент</p>
            <p className="font-medium">{service.user_email}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Тип</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
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
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Стоимость в день (₽)</label>
            <Input
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
