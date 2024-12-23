'use client';

import { motion } from 'framer-motion';
import { Search, LineChart, Settings, Clock, Users, Zap } from 'lucide-react';

export function AdvantagesSection() {
  const advantages = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Тщательный подбор площадок',
      description:
        'Анализируем активность и качество аудитории каждого сообщества перед размещением',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Прозрачная статистика',
      description:
        'Предоставляем отчеты по каждому размещению с реальными показателями охвата и активности',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Гибкие условия',
      description:
        'Работаем с любым бюджетом, подбираем оптимальные площадки под ваши задачи',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Быстрый запуск',
      description:
        'Размещаем рекламу в течение 1-2 дней после согласования площадок и материалов',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Личный менеджер',
      description:
        'Ваш персональный менеджер всегда на связи и готов ответить на любые вопросы',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Помощь с контентом',
      description:
        'Помогаем с подготовкой рекламных материалов и текстов для публикаций',
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Наши преимущества</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Работаем с проверенными площадками и гарантируем качество размещений
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
              <p className="text-muted-foreground">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
