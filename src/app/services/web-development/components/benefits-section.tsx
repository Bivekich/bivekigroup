'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const benefits = [
  {
    title: 'Адаптивный дизайн',
    description: 'Сайт отлично выглядит на всех устройствах',
  },
  {
    title: 'SEO-оптимизация',
    description: 'Базовая оптимизация для поисковых систем',
  },
  {
    title: 'Система управления',
    description: 'Удобная панель управления контентом',
  },
  {
    title: 'Высокая скорость',
    description: 'Оптимизированная производительность',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Мы поможем вам</h2>
            <div className="space-y-4">
              {[
                'Создать современный сайт с уникальным дизайном',
                'Привлечь новых клиентов через интернет',
                'Автоматизировать работу с заявками',
                'Увеличить продажи и прибыль',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background rounded-2xl p-8 shadow-lg"
          >
            <div className="space-y-6">
              {benefits.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
