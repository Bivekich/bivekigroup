'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '../user-provider';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { ApiKeySection } from './api-key';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailFormData {
  newEmail: string;
  password: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, setUser } = useUser();
  const router = useRouter();
  const currentTime = format(new Date(), 'PPPp', { locale: ru });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmail,
  } = useForm<EmailFormData>();

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Пароли не совпадают',
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка при смене пароля');
      }

      setIsPasswordDialogOpen(false);
      resetPassword();
      toast({
        title: 'Успешно',
        description: 'Пароль успешно изменен',
      });

      // Перезагружаем страницу для обновления данных
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Произошла ошибка',
      });
    }
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEmail: data.newEmail,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка при смене email');
      }

      setIsEmailDialogOpen(false);
      resetEmail();
      toast({
        title: 'Успешно',
        description: 'Email успешно изменен',
      });

      // Перезагружаем страницу для обновления данных
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description:
          error instanceof Error ? error.message : 'Произошла ошибка',
      });
    }
  };

  const handleApiKeyUpdate = (apiKey: string) => {
    if (user) {
      setUser({
        ...user,
        api_key: apiKey,
      });
    }
  };

  return (
    <div className="container max-w-4xl py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Профиль</h1>

      <Card>
        <CardHeader>
          <CardTitle>Учетные данные</CardTitle>
          <CardDescription>
            Управление вашими личными данными и безопасностью
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>Личный номер (ID)</Label>
            <div className="text-base sm:text-lg font-medium">{user?.id}</div>
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="text-base sm:text-lg font-medium break-all">
                {user?.email}
              </div>
              <Dialog
                open={isEmailDialogOpen}
                onOpenChange={setIsEmailDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Сменить
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Смена email</DialogTitle>
                    <DialogDescription>
                      Введите новый email и текущий пароль для подтверждения
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmitEmail(onEmailSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="newEmail">Новый email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        {...registerEmail('newEmail', {
                          required: 'Email обязателен',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Неверный формат email',
                          },
                        })}
                      />
                      {emailErrors.newEmail && (
                        <p className="text-sm text-destructive">
                          {emailErrors.newEmail.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emailPassword">Текущий пароль</Label>
                      <Input
                        id="emailPassword"
                        type="password"
                        {...registerEmail('password', {
                          required: 'Пароль обязателен',
                        })}
                      />
                      {emailErrors.password && (
                        <p className="text-sm text-destructive">
                          {emailErrors.password.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      Сохранить
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Пароль</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="text-base sm:text-lg font-medium">••••••••</div>
              <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Сменить
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Смена пароля</DialogTitle>
                    <DialogDescription>
                      Введите текущий пароль и новый пароль
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmitPassword(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...registerPassword('currentPassword', {
                          required: 'Текущий пароль обязателен',
                        })}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword('newPassword', {
                          required: 'Новый пароль обязателен',
                          minLength: {
                            value: 6,
                            message: 'Минимальная длина пароля 6 символов',
                          },
                        })}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">
                        Подтвердите пароль
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword('confirmPassword', {
                          required: 'Подтвердите пароль',
                          validate: (value, formValues) =>
                            value === formValues.newPassword ||
                            'Пароли не совпадают',
                        })}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      Сохранить
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Ваше время</Label>
            <div className="text-base sm:text-lg font-medium">
              {currentTime}
            </div>
          </div>
        </CardContent>
      </Card>

      {user && (
        <ApiKeySection user={user} onApiKeyUpdate={handleApiKeyUpdate} />
      )}
    </div>
  );
}
