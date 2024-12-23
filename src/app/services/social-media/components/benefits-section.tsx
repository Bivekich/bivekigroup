'use client';

import { motion } from 'framer-motion';
import {
  Target,
  Users,
  TrendingUp,
  MessageCircle,
  Share2,
  Megaphone,
} from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Целевая аудитория',
      description:
        'Размещаем рекламу в тематических сообществах, где находится ваша целевая аудитория',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Живые подписчики',
      description:
        'Ваше объявление увидят реальные люди, которые интересуются вашей тематикой',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Быстрый результат',
      description:
        'Получайте первые обращения сразу после публикации рекламного поста',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Обратная связь',
      description:
        'Пользователи могут комментировать и задавать вопросы прямо под постом',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Вирусный эффект',
      description:
        'Пользователи могут делиться вашими постами, увеличивая охват рекламы',
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: 'Гибкий бюджет',
      description:
        'Подбираем площадки под любой бюджет - от небольших групп до крупных сообществ',
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
          <h2 className="text-3xl font-bold mb-4">
            Чем полезна реклама в соцсетях
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Размещение рекламы в тематических сообществах - эффективный способ
            привлечь новых клиентов для вашего бизнеса
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
