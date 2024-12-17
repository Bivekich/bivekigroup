'use client';

import { motion } from 'framer-motion';
import { Globe, LayoutDashboard, Megaphone, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';

const services = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Разработка сайтов',
    description:
      'Создаем современные веб-сайты с уникальным дизайном, адаптивной версткой и удобной CMS для управления контентом.',
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: 'Внедрение CRM',
    description:
      'Автоматизируем бизнес-процессы, внедряем и настраиваем CRM-системы под ваши задачи. Обучаем персонал.',
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: 'Интернет-реклама',
    description:
      'Настраиваем эффективную рекламу в Яндекс Директ. Приводим целевых клиентов из поиска.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Продвижение в соцсетях',
    description:
      'Разраб��тываем стратегию, ведем аккаунты, запускаем таргетированную рекламу в социальных сетях.',
  },
];

export function ServicesSection() {
  const { open } = useContactModal();

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
          <h2 className="text-4xl font-bold mb-4">Наши услуги</h2>
          <p className="text-xl text-muted-foreground">
            Комплексные IT-решения для вашего бизнеса
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="font-medium" onClick={open}>
            Обсудить проект
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
