'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';

const tariffs = [
  {
    name: 'Лендинг',
    price: 'от 20 000 ₽',
    features: [
      'Одностраничный сайт',
      'Адаптивный дизайн',
      'Форма обратной связи',
      'Базовая SEO-оптимизация',
    ],
  },
  {
    name: 'Корпоративный сайт',
    price: 'от 55 000 ₽',
    features: [
      'До 10 страниц',
      'Уникальный дизайн',
      'Система управления',
      'Интеграция с CRM',
    ],
    popular: true,
  },
  {
    name: 'Интернет-магазин',
    price: 'от 90 000 ₽',
    features: [
      'Каталог товаров',
      'Корзина и оплата',
      'Личный кабинет',
      'Интеграции со складом',
    ],
  },
];

export function TariffsSection() {
  const { openWithData } = useContactModal();

  const handleTariffSelect = (tariffName: string) => {
    openWithData({
      tariff: tariffName,
      page: 'Разработка сайтов',
    });
  };

  return (
    <section id="tariffs" className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Тарифы и цены</h2>
          <p className="text-xl text-muted-foreground">
            Выберите подходящий тариф для вашего проекта
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tariffs.map((tariff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-background rounded-xl p-8 border ${
                tariff.popular
                  ? 'border-primary shadow-lg'
                  : 'border-border hover:shadow-lg'
              } transition-shadow relative`}
            >
              {tariff.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Популярный
                  </div>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{tariff.name}</h3>
                <p className="text-2xl font-bold">{tariff.price}</p>
              </div>
              <div className="space-y-3">
                {tariff.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-8"
                variant={tariff.popular ? 'default' : 'outline'}
                onClick={() => handleTariffSelect(tariff.name)}
              >
                Выбрать тариф
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
