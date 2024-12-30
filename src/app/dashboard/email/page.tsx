'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmailPage() {
  const router = useRouter();

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Email рассылки</h1>
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-yellow-500" />В разработке
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Сервис email рассылок находится в активной разработке. Ожидаемая
            дата выпуска: Q3 2025
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">Планируемые функции:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Создание и управление списками рассылки</li>
              <li>Конструктор email шаблонов</li>
              <li>Автоматизация рассылок</li>
              <li>Статистика и аналитика</li>
              <li>A/B тестирование</li>
              <li>Интеграция с CRM системой</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Тариф
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-medium">Email рассылки</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-bold">250₽</span>
              <span className="text-muted-foreground">/месяц</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Полный доступ к функционалу email рассылок с неограниченным
              количеством писем
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Почему стоит подождать?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Интеграция с сервисами</h3>
              <p className="text-sm text-muted-foreground">
                Полная интеграция со всеми нашими сервисами для максимальной
                эффективности
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Простота использования</h3>
              <p className="text-sm text-muted-foreground">
                Интуитивно понятный интерфейс и автоматизация рутинных задач
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Аналитика</h3>
              <p className="text-sm text-muted-foreground">
                Подробная статистика по каждой рассылке и подписчику
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Безопасность</h3>
              <p className="text-sm text-muted-foreground">
                Защита от спама и гарантированная доставка писем
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
