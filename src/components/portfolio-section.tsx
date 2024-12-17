'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const portfolioItems = [
  {
    image: '/portfolio/project1.webp',
    title: 'Solovey3D',
    description:
      'Лендинг для компании по 3D-печати с онлайн-калькулятором стоимости и формой заказа',
  },
  {
    image: '/portfolio/project2.webp',
    title: 'ПротекСпец',
    description:
      'Корпоративный сайт с каталогом запчастей для спецтехники и системой онлайн-аренды',
  },
  {
    image: '/portfolio/project3.webp',
    title: 'FoodStore',
    description:
      'Интернет-магазин фермерских продуктов с личными кабинетами и онлайн-оплатой',
  },
  {
    image: '/portfolio/project4.webp',
    title: 'Sklad4Phone',
    description:
      'Telegram-бот для заказа техники из Дубая с автоматическим расчетом стоимости и доставки',
  },
];

export function PortfolioSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Наши последние проекты</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы создаем сложные веб-системы для бизнеса любого масштаба. Каждый
            проект уникален и разрабатывается с учетом специфики вашей отрасли.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-background rounded-xl overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/projects">
            <Button size="lg" className="font-medium">
              Смотреть все проекты <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
