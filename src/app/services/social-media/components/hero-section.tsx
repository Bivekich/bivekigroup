'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';
import { Users, Target, Share2 } from 'lucide-react';

export function HeroSection() {
  const { open } = useContactModal();

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      value: '100+',
      label: 'Тематических площадок',
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      value: '500+',
      label: 'Размещений',
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: '10+',
      label: 'Категорий групп',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold">
                Реклама в сообществах социальных сетей
              </h1>
              <p className="text-xl text-muted-foreground">
                Размещаем рекламные посты в тематических группах ВКонтакте,
                каналах Telegram и сообществах Одноклассники. Подбираем площадки
                под ваш бюджет и целевую аудиторию.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={open}>
                Обсудить размещение
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2 text-center"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video bg-background rounded-lg shadow-lg p-6"
          >
            {/* Имитация интерфейса соцсетей */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-primary/10 rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
              <div className="aspect-video bg-muted rounded-lg" />
              <div className="flex gap-4">
                <div className="h-8 bg-primary/10 rounded flex-1" />
                <div className="h-8 bg-primary/10 rounded flex-1" />
                <div className="h-8 bg-primary/10 rounded flex-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
