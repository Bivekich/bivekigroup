'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Users, Clock } from 'lucide-react';

const advantages = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Гарантия качества',
    description: 'Гарантируем качество разработки и поддержку после запуска',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Быстрая разработка',
    description: 'Запускаем проекты в короткие сроки без потери качества',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Опытная команда',
    description: 'Команда опытных разработчиков и дизайнеров',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Точно в срок',
    description: 'Соблюдаем сроки и держим в курсе о ходе работ',
  },
];

export function AdvantagesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-xl text-muted-foreground">
            Создаем сайты, которые помогают бизнесу расти
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
