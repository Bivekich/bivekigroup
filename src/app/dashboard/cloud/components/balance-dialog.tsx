'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface BalanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  onBalanceUpdated: () => void;
}

export function BalanceDialog({
  isOpen,
  onClose,
  userId,
  userEmail,
  onBalanceUpdated,
}: BalanceDialogProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/cloud/balance/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch balance');
        const data = await response.json();
        setCurrentBalance(data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить баланс пользователя',
          variant: 'destructive',
        });
      }
    };

    if (isOpen && userId) {
      fetchBalance();
    }
  }, [isOpen, userId]);

  const handleSubmit = async () => {
    if (!amount) {
      toast({
        title: 'Ошибка',
        description: 'Введите сумму',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/cloud/balance/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при изменении баланса');
      }

      toast({
        title: 'Успешно',
        description: 'Баланс пользователя обновлен',
      });

      onClose();
      setAmount('');
      onBalanceUpdated();
    } catch (error) {
      console.error('Ошибка при изменении баланса:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить баланс',
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
          <DialogTitle>Изменить баланс пользователя</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Клиент</p>
            <p className="font-medium">{userEmail}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Текущий баланс</p>
            <p className="font-medium">
              {currentBalance.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Сумма (₽)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите отрицательное значение для списания средств"
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
