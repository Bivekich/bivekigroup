'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Construction,
  ArrowLeft,
  CreditCard,
  Server,
  Database,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CloudPage() {
  const router = useRouter();

  return (
    <div className="container max-w-3xl py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Облачные услуги</h1>
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader className="space-y-1 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-yellow-500" />В разработке
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            Сервис облачных услуг находится в активной разработке. Ожидаемая
            дата выпуска: Q2 2025
          </p>
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-medium">
              Планируемые функции:
            </h3>
            <ul className="text-sm sm:text-base list-disc list-inside space-y-1 text-muted-foreground">
              <li>Создание виртуальных серверов</li>
              <li>Базы данных MySQL и PostgreSQL</li>
              <li>Базовый мониторинг</li>
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
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <h3 className="text-sm sm:text-base font-medium">
                  Облачные серверы
                </h3>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-xl sm:text-2xl font-bold">от 450₽</span>
                <span className="text-sm text-muted-foreground">/месяц</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Виртуальные серверы с гарантированными ресурсами и высокой
                производительностью
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-sm sm:text-base font-medium">
                  Облачные базы данных
                </h3>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-xl sm:text-2xl font-bold">от 350₽</span>
                <span className="text-sm text-muted-foreground">/месяц</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Управляемые базы данных с автоматическим резервным копированием
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
              <h3 className="text-sm sm:text-base font-medium">Надежность</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Высокая доступность и отказоустойчивость облачной инфраструктуры
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">
                Масштабируемость
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Гибкое управление ресурсами и автоматическое масштабирование
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Безопасность</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Современные методы защиты данных и шифрование
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium">Интеграция</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Полная интеграция со всеми сервисами платформы
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
