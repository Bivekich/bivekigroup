'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';
import { Code2, Rocket, Users2, LineChart } from 'lucide-react';

export function WebsiteSection() {
  const { open } = useContactModal();

  const stats = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: '50+',
      description: 'Успешных проектов',
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: '100%',
      description: 'Довольных клиентов',
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: '24/7',
      description: 'Техподдержка',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: '80%',
      description: 'Повторных обращений',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="block">Создаем сайты</span>
                <span className="block mt-1 sm:mt-2">для вашего бизнеса</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                От простых лендингов до сложных веб-приложений. Разрабатываем
                индивидуальный дизайн и адаптируем его под все устройства.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Типы проектов
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>• Корпоративные сайты</li>
                  <li>• Интернет-магазины</li>
                  <li>• Лендинги</li>
                  <li>• Веб-приложения</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Включено в работу
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>• Уникальный дизайн</li>
                  <li>• Адаптивная верстка</li>
                  <li>• SEO-оптимизация</li>
                  <li>• Система управления</li>
                </ul>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto font-medium"
              onClick={open}
            >
              Обсудить проект
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center text-primary mb-3 sm:mb-4">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary">
                    {stat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
