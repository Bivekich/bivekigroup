'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cloud, Server, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PriceCard {
  title: string;
  price: string;
  specs: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const priceCards: PriceCard[] = [
  {
    title: 'Облачные серверы',
    price: 'от 300 ₽/мес',
    specs: [
      'Процессор: 1 x 3.3 ГГц',
      'Память: 1 ГБ',
      'NVMe: 15 ГБ',
      'Канал: 1 Гбит/с',
      'Публичный IP',
    ],
    icon: Server,
  },
  {
    title: 'Облачные базы данных',
    price: 'от 230 ₽/мес',
    specs: [
      'Процессор: 1 x 3.3 ГГц',
      'Память: 1 ГБ',
      'Диск NVMe: 8 ГБ',
      'Приватный IP',
      'Резервные копии',
    ],
    icon: Database,
  },
];

export default function CloudPage() {
  const router = useRouter();

  return (
    <div className="max-w-[50%]">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Облачные услуги</h1>
      </div>

      <div className="space-y-6">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-yellow-500" />В разработке
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Мы работаем над созданием надежной облачной инфраструктуры.
              Ожидаемая дата выпуска: Q2 2025
            </p>
            <h3 className="font-medium mb-2">Планируемые функции:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Виртуальные серверы с гарантированными ресурсами</li>
              <li>
                • Облачные базы данных с автоматическим резервным копированием
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-muted-foreground" />
              Тарифы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {priceCards.map((card, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{card.price}</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {card.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Почему стоит подождать?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  Подробная статистика и мониторинг всех ресурсов
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Безопасность</h3>
                <p className="text-sm text-muted-foreground">
                  Защита от DDoS-атак и регулярное резервное копирование
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
