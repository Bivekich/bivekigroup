'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function ReviewsPage() {
  const reviewsUrl = 'https://yandex.ru/maps/org/202590313562/reviews';

  return (
    <div className="container max-w-4xl py-4 sm:py-6 space-y-4 sm:space-y-6 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl sm:text-3xl font-bold">Отзывы</h1>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-lg">Нам важно ваше мнение</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm dark:prose-invert">
            <p>
              Мы стремимся предоставлять качественные услуги и постоянно
              работаем над улучшением нашего сервиса. Ваш отзыв поможет нам
              стать лучше, а другим клиентам - принять решение о сотрудничестве.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between p-6 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">
                Отсканируйте QR-код чтобы оставить отзыв
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <QRCodeCanvas
                value={reviewsUrl}
                size={120}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => window.open(reviewsUrl, '_blank')}
            >
              Оставить отзыв
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Нажимая кнопку &quot;Оставить отзыв&quot;, вы будете перенаправлены
            на страницу нашей компании на Яндекс.Картах
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
