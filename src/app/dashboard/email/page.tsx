'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmailPage() {
  const router = useRouter();

  return (
    <div className="container max-w-3xl py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Email рассылки</h1>
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-yellow-500" />В разработке
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            Сервис email рассылок находится в активной разработке. Ожидаемая
            дата выпуска: Q3 2025
          </p>
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-medium">
              Планируемые функции:
            </h3>
            <ul className="text-sm sm:text-base list-disc list-inside space-y-1 text-muted-foreground">
              <li>Создание и отправка рассылок</li>
              <li>Шаблоны писем</li>
              <li>Базовая статистика</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Тариф
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 sm:p-4 rounded-lg border bg-card">
            <h3 className="text-sm sm:text-base font-medium">Email рассылки</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl sm:text-2xl font-bold">550₽</span>
              <span className="text-sm text-muted-foreground">/месяц</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Полный доступ к сервису email-рассылок без ограничений
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle>Почему стоит подождать?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Простота</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Интуитивно понятный интерфейс для создания рассылок
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Шаблоны</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Готовые шаблоны писем для разных целей
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Статистика</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Отслеживание открытий и переходов
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Поддержка</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Техническая поддержка и помощь в настройке
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
