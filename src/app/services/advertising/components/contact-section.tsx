'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';
import { ArrowRight, Target, LineChart, Users } from 'lucide-react';

export function ContactSection() {
  const { openWithData } = useContactModal();

  const handleClick = () => {
    openWithData({
      tariff: 'Реклама в Яндекс',
      page: 'Реклама в Яндекс',
    });
  };

  const features = [
    {
      icon: <Target className="w-5 h-5" />,
      text: 'Точное попадание в целевую аудиторию',
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      text: 'Прозрачная аналитика и отчетность',
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'Персональный менеджер',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Фоновый градиент */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl" />

          <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-lg border">
            <div className="grid lg:grid-cols-[2fr,1fr] gap-8 items-center">
              <div className="space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl font-bold"
                >
                  Готовы увеличить продажи?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground"
                >
                  Оставьте заявку, и мы проведем бесплатный аудит вашей ниши.
                  Расскажем о возможностях рекламы и подготовим индивидуальное
                  предложение.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-6"
                >
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base group"
                  onClick={handleClick}
                >
                  Получить предложение
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  Обычно отвечаем в течение 2 часов
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
