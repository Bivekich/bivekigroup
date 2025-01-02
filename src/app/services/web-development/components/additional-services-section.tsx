'use client';

import { motion } from 'framer-motion';

const services = [
  {
    title: 'Наполнение товаров/услуг',
    price: 'от 2 500 ₽',
    description: 'За каждые 10 дополнительных позиций',
  },
  {
    title: 'Копирайтинг текстов',
    price: '900 ₽',
    description: 'Написание уникальных текстов, за 1 страницу',
  },
  {
    title: 'Дополнительная страница',
    price: '10 000 ₽',
    description: 'Разработка дополнительной внутренней страницы',
  },
  {
    title: 'Разработка баннеров',
    price: '2 500 ₽',
    description: 'Создание дополнительных рекламных баннеров',
  },
  {
    title: 'Подключение домена',
    price: '2 500 ₽',
    description: 'Подбор и настройка домена (без учета стоимости)',
  },
  {
    title: 'Разработка логотипа',
    price: '20 000 ₽',
    description: 'Создание двух вариантов логотипа',
  },
  {
    title: 'Обучение',
    price: '4 000 ₽',
    description: 'Обучение работе с контентом сайта',
  },
  {
    title: 'Дополнительные правки',
    price: '5 000 ₽',
    description: 'Дополнительная итерация правок по дизайну',
  },
];

export function AdditionalServicesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Дополнительные услуги</h2>
          <p className="text-xl text-muted-foreground">
            Расширьте возможности вашего сайта
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-border"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <div className="text-primary font-medium whitespace-nowrap ml-4">
                  {service.price}
                </div>
              </div>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
