'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdjustBalanceDialogProps {
  userId: number;
  userEmail: string;
  onBalanceUpdated: () => void;
}

export function AdjustBalanceDialog({
  userId,
  userEmail,
  onBalanceUpdated,
}: AdjustBalanceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        userId,
        amount: parseFloat(formData.get('amount') as string),
        method: 'invoice',
      };

      const response = await fetch('/api/cloud/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при изменении баланса');
      }

      toast({
        title: 'Успешно',
        description: 'Баланс обновлен',
      });

      setIsOpen(false);
      onBalanceUpdated();
    } catch (error) {
      console.error('Ошибка при изменении баланса:', error);
      toast({
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Не удалось изменить баланс',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Wallet className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить баланс пользователя</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Клиент: {userEmail}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Сумма (₽)</label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Введите сумму"
              required
            />
            <p className="text-xs text-muted-foreground">
              Введите отрицательное значение для списания средств
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
