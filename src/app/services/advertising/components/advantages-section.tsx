'use client';

import { motion } from 'framer-motion';
import { Target, LineChart, Settings, Search, Users, Zap } from 'lucide-react';

export function AdvantagesSection() {
  const advantages = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Точное попадание в цель',
      description:
        'Настраиваем рекламу на вашу целевую аудиторию с учетом демографии, интересов и поведения',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Прозрачная аналитика',
      description:
        'Предоставляем подробные отчеты о результатах рекламы и постоянно оптимизируем кампании',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Гибкая настройка',
      description:
        'Адаптируем рекламные кампании под ваши цели и бюджет, корректируем стратегию на основе результатов',
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Глубокая аналитика',
      description:
        'Анализируем конкурентов, подбираем эффективные ключевые слова и места размещения',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Персональный подход',
      description:
        'Выделяем персонального менеджера, который всегда на связи и готов ответить на ваши вопросы',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Быстрый запуск',
      description:
        'Оперативно запускаем рекламные кампании и начинаем привлекать клиентов уже в первые дни',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Наши преимущества</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Используем передовые технологии и проверенные методики для
            достижения максимальных результатов
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
