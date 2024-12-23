'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    image: '/portfolio/project1.webp',
    title: 'Solovey3D',
    type: 'Лендинг',
    description:
      'Сайт для компании по 3D-печати с онлайн-калькулятором стоимости и формой заказа',
  },
  {
    image: '/portfolio/project2.webp',
    title: 'ПротекСпец',
    description:
      'Корпоративный сайт с каталогом запчастей для спецтехники и системой онлайн-аренды',
    type: 'Корпоративный сайт',
  },
  {
    image: '/portfolio/project3.webp',
    title: 'FoodStore',
    type: 'Интернет-магазин',
    description:
      'Интернет-магазин фермерских продуктов с личными кабинетами и онлайн-оплатой',
  },
];

export function PortfolioSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Примеры наших работ</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Реализованные проекты для наших клиентов. Каждый проект уникален и
            разработан с учетом специфики бизнеса.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="inline-flex mb-3">
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {project.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/projects">
            <Button size="lg" className="font-medium group" variant="outline">
              Смотреть все проекты
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
