'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CRMPage() {
  const router = useRouter();

  return (
    <div className="container max-w-3xl py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">CRM система</h1>
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-yellow-500" />В разработке
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            CRM система находится в активной разработке. Ожидаемая дата выпуска:
            Q4 2025
          </p>
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-medium">
              Планируемые функции:
            </h3>
            <ul className="text-sm sm:text-base list-disc list-inside space-y-1 text-muted-foreground">
              <li>Управление клиентской базой</li>
              <li>Отслеживание сделок</li>
              <li>Базовая аналитика</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Тарифы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-3 sm:p-4 rounded-lg border bg-card">
              <h3 className="text-sm sm:text-base font-medium">CRM система</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-xl sm:text-2xl font-bold">1150₽</span>
                <span className="text-sm text-muted-foreground">/месяц</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Полный доступ к CRM системе
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg border bg-card">
              <h3 className="text-sm sm:text-base font-medium">
                Интеграция на сайт
              </h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-xl sm:text-2xl font-bold">4900₽</span>
                <span className="text-sm text-muted-foreground">разово</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Установка и настройка CRM на ваш сайт
              </p>
            </div>
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
                Интуитивно понятный интерфейс для удобной работы
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Интеграция</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Легкая интеграция с вашим сайтом и другими сервисами
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Аналитика</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Базовые отчеты для анализа продаж и клиентов
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Поддержка</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Техническая поддержка и обучение использованию системы
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
