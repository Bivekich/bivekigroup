'use client';

import { motion } from 'framer-motion';
import { Globe, Database, LineChart, Users, Cloud, Mail } from 'lucide-react';
import { Metadata } from 'next';
import { pagesMetadata } from '../metadata';

interface ServiceItem {
  icon: React.ReactElement;
  title: string;
  description: string;
  features: string[];
  soon?: boolean;
}

export const metadata: Metadata = {
  title: pagesMetadata['/services'].title,
  description: pagesMetadata['/services'].description,
  openGraph: {
    title: pagesMetadata['/services'].title,
    description: pagesMetadata['/services'].description,
  },
};

export default function ServicesPage() {
  const services = [
    {
      category: 'Доступно сейчас',
      items: [
        {
          icon: <Globe className="w-6 h-6" />,
          title: 'Разработка сайта',
          description:
            'Создаем современные сайты с уникальным дизайном и адаптивной версткой. От лендингов до крупных веб-приложений.',
          features: [
            'Адаптивный дизайн',
            'SEO-оптимизация',
            'Высокая производительность',
            'Система управления контентом',
          ],
        } as ServiceItem,
        {
          icon: <LineChart className="w-6 h-6" />,
          title: 'Интернет реклама',
          description:
            'Настраиваем эффективную рекламу в Яндекс Директ. Приводим целевых клиентов из поиска.',
          features: [
            'Анализ конкурентов',
            'Подбор ключевых слов',
            'A/B тестирование',
            'Ежемесячная оптимизация',
          ],
        } as ServiceItem,
        {
          icon: <Users className="w-6 h-6" />,
          title: 'Реклама в соцсетях',
          description:
            'Разрабатываем стратегию продвижения, создаем контент и настраиваем таргетированную рекламу.',
          features: ['ВКонтакте', 'Telegram', 'Дзен', 'Контент-план'],
        } as ServiceItem,
      ],
    },
    {
      category: 'Скоро в Biveki Group',
      items: [
        {
          icon: <Database className="w-6 h-6" />,
          title: 'Интеграция CRM',
          description:
            'Внедрение нашей CRM-системы в ваш бизнес. Автоматизация процессов и повышение эффективности продаж.',
          features: [
            'Единая база клиентов',
            'Автоматизация продаж',
            'Аналитика и отчеты',
            'Интеграции с сайтом',
          ],
          soon: true,
        } as ServiceItem,
        {
          icon: <Cloud className="w-6 h-6" />,
          title: 'Инфраструктурные решения',
          description:
            'Развора��иваем и настраиваем серверы, базы данных и другие IT-системы для вашего бизнеса.',
          features: [
            'Выделенные серверы',
            'Базы данных',
            'Резервное копирование',
            'Мониторинг систем',
          ],
          soon: true,
        } as ServiceItem,
        {
          icon: <Mail className="w-6 h-6" />,
          title: 'Email рассылки',
          description:
            'Сервис email рассылок с готовыми шаблонами и аналитикой. Эффективно взаимодействуйте с клиентами.',
          features: [
            'Готовые шаблоны',
            'Сегментация базы',
            'Детальная аналитика',
            'A/B тестирование',
          ],
          soon: true,
        } as ServiceItem,
      ],
    },
  ];

  return (
    <div className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-bold">Наши услуги</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Разрабатываем сложные веб-проекты и создаем эффективные
              бизнес-решения. От идеи до реализации и поддержки.
            </p>
          </motion.div>
        </div>

        <div className="space-y-24">
          {services.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-12">{section.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((service, serviceIndex) => (
                  <motion.div
                    key={serviceIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: sectionIndex * 0.1 + serviceIndex * 0.1,
                    }}
                    className="bg-card rounded-2xl p-8 hover:shadow-lg transition-shadow border border-border"
                  >
                    {service.soon && (
                      <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                        Скоро
                      </div>
                    )}
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
