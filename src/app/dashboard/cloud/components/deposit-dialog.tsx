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
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '../../user-provider';
import { sendTelegramMessage } from '@/lib/telegram';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const [amount, setAmount] = useState('');
  const [inn, setInn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice' | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useUser();

  const handleAmountChange = (value: string) => {
    // Разрешаем только цифры
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleInnChange = (value: string) => {
    // Разрешаем только цифры, максимум 12 символов
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 12);
    setInn(numericValue);
  };

  const validateInn = (inn: string) => {
    // ИНН может быть 10 или 12 цифр
    return inn.length === 10 || inn.length === 12;
  };

  const handleCardPayment = async () => {
    const numericAmount = parseInt(amount);

    if (numericAmount < 100) {
      toast({
        title: 'Ошибка',
        description: 'Минимальная сумма пополнения: 100 ₽',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Создаем платеж через API Альфа Банка
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          type: 'card',
          email: user?.email,
          successUrl: window.location.origin + '/dashboard/cloud',
          failUrl: window.location.origin + '/dashboard/cloud',
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании платежа');
      }

      const data = await response.json();
      // Редирект на страницу оплаты
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать платёж',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvoicePayment = async () => {
    const numericAmount = parseInt(amount);

    if (numericAmount < 100) {
      toast({
        title: 'Ошибка',
        description: 'Минимальная сумма пополнения: 100 ₽',
        variant: 'destructive',
      });
      return;
    }

    if (!validateInn(inn)) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректный ИНН (10 или 12 цифр)',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Отправляем уведомление в Telegram
      await sendTelegramMessage(
        `💰 Запрос на выставление счета\nКлиент: ${user?.email}\nИНН: ${inn}\nСумма: ${numericAmount} ₽`
      );

      toast({
        title: 'Успешно',
        description: 'Счет будет отправлен на вашу почту в ближайшее время',
      });

      setIsOpen(false);
      setAmount('');
      setInn('');
      setPaymentMethod(null);
    } catch (error) {
      console.error('Ошибка при создании счета:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать счет',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Пополнить баланс</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Пополнение баланса</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Сумма пополнения (₽)</label>
            <Input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Введите сумму"
            />
            <p className="text-xs text-muted-foreground">
              Минимальная сумма пополнения: 100 ₽
            </p>
          </div>

          {!paymentMethod ? (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => setPaymentMethod('card')}
                disabled={isLoading || !amount || parseInt(amount) < 100}
              >
                Оплата картой
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPaymentMethod('invoice')}
                disabled={isLoading || !amount || parseInt(amount) < 100}
              >
                Выставить счёт
              </Button>
            </div>
          ) : paymentMethod === 'invoice' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ИНН</label>
                <Input
                  type="text"
                  value={inn}
                  onChange={(e) => handleInnChange(e.target.value)}
                  placeholder="Введите ИНН организации"
                />
                <p className="text-xs text-muted-foreground">
                  Для выставления счета необходим ИНН организации (10 или 12
                  цифр)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setPaymentMethod(null)}
                >
                  Назад
                </Button>
                <Button
                  className="w-full"
                  onClick={handleInvoicePayment}
                  disabled={isLoading || !validateInn(inn)}
                >
                  Выставить счёт
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPaymentMethod(null)}
              >
                Назад
              </Button>
              <Button
                className="w-full"
                onClick={handleCardPayment}
                disabled={isLoading}
              >
                Оплатить
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
