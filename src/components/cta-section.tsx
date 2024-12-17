'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Rocket, Shield, Zap } from 'lucide-react';
import { useContactModal } from '@/hooks/use-contact-modal';

export function CtaSection() {
  const { open } = useContactModal();

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold">
            Запустите свой проект
            <br />
            вместе с Biveki Group
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Разрабатываем сложные веб-проекты и создаем эффективные
            бизнес-решения. Гарантируем качество, соблюдение сроков и
            прозрачность на всех этапах работы.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
        >
          {[
            {
              icon: <Rocket className="w-6 h-6" />,
              title: 'Современные технологии',
              description:
                'Используем передовой стек технологий для создания надежных решений',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Гарантия качества',
              description: 'Тестируем каждый проект на всех этапах разработки',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Быстрый запуск',
              description: 'Оперативно реализуем проекты любой сложности',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button size="lg" className="font-medium" onClick={open}>
            Обсудить проект <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
