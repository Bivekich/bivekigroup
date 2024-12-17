'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Rocket,
  Handshake,
  Wrench,
  Search,
  ArrowUpRight,
} from 'lucide-react';

const features = [
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Современные технологии',
    description:
      'Используем передовой стек технологий для разработки: React, Next.js, Node.js и другие',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Быстрая работа',
    description:
      'Оптимизированные процессы разработки позволяют создавать проекты в короткие сроки',
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: 'Поддержка и забота',
    description:
      'Предоставляем техническую поддержку 24/7 и помогаем развивать ваш проект',
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: 'Гибкая разработка',
    description:
      'Адаптируем решения под ваши задачи, масштабируем проекты по мере роста бизнеса',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'SEO-оптимизация',
    description:
      'Встроенная оптимизация для поисковых систем и высокая производительность',
  },
  {
    icon: <ArrowUpRight className="w-6 h-6" />,
    title: 'Интеграции',
    description:
      'Подключаем платежные системы, CRM, аналитику и другие необходимые сервисы',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Преимущества</h2>
          <p className="text-xl text-muted-foreground">
            Почему клиенты выбирают нас
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
