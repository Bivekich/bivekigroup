'use client';

import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

export function ResponsiveSection() {
  const features = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Десктоп версия',
      description:
        'Полнофункциональный интерфейс для работы на больших экранах',
    },
    {
      icon: <Tablet className="w-6 h-6" />,
      title: 'Планшетная версия',
      description: 'Удобное управление для устройств среднего размера',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Мобильная версия',
      description: 'Оптимизированный интерфейс для смартфонов',
    },
  ];

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
          <h2 className="text-4xl font-bold mb-4">Мобильная версия</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ваш сайт будет отлично выглядеть и на компьютере, и на планшете, и
            на мобильном телефоне.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-[600px] flex items-center justify-center"
          >
            {/* Имитация устройств */}
            <div className="relative w-full h-full">
              {/* Десктоп */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-[300px] bg-background rounded-lg shadow-lg p-4"
              >
                {/* Имитация интерфейса */}
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-primary/10 rounded w-3/4" />
                  <div className="h-4 bg-primary/10 rounded w-1/2" />
                  <div className="h-4 bg-primary/10 rounded w-2/3" />
                </div>
              </motion.div>

              {/* Планшет */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-[150px] right-0 w-[300px] h-[400px] bg-background rounded-lg shadow-lg p-4"
              >
                <div className="flex gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-primary/10 rounded w-3/4" />
                  <div className="h-3 bg-primary/10 rounded w-1/2" />
                  <div className="h-3 bg-primary/10 rounded w-2/3" />
                </div>
              </motion.div>

              {/* Мобильный */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute bottom-0 left-[100px] w-[150px] h-[300px] bg-background rounded-lg shadow-lg p-3"
              >
                <div className="flex gap-1 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-primary/10 rounded w-3/4" />
                  <div className="h-2 bg-primary/10 rounded w-1/2" />
                  <div className="h-2 bg-primary/10 rounded w-2/3" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex gap-4 items-start bg-background rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
