'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';
import { LineChart, Target, Users } from 'lucide-react';

export function HeroSection() {
  const { open } = useContactModal();

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      value: '100%',
      label: 'Целевой трафик',
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      value: 'от 15%',
      label: 'Рост конверсии',
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: '1000+',
      label: 'Клиентов привлечено',
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
                Эффективная интернет-реклама для вашего бизнеса
              </h1>
              <p className="text-xl text-muted-foreground">
                Настраиваем рекламные кампании в Яндекс Директ, которые приводят
                целевых клиентов и увеличивают продажи.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={open}>
                Обсудить проект
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
            {/* Имитация графиков и статистики */}
            <div className="space-y-6">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-8 bg-primary/10 rounded-md"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: '0%', opacity: 0 }}
                      animate={{ width: '100%', opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                      className="h-4 bg-muted rounded"
                    />
                  ))}
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="aspect-square bg-primary/10 rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
