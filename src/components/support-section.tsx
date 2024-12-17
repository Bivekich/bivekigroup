'use client';

import { motion } from 'framer-motion';
import { Clock, MessageCircle, FileText, Headphones } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

export function SupportSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">
                Профессиональная поддержка
                <br />
                на всех этапах разработки
              </h2>
              <p className="text-xl text-muted-foreground">
                Наша команда разработчиков и менеджеров всегда на связи.
                Помогаем с настройкой, обучаем работе с системой и оперативно
                решаем любые возникающие вопросы.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: 'Быстрая реакция',
                  description: 'Отвечаем на запросы в течение рабочего дня',
                },
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  title: 'Личный менеджер',
                  description:
                    'Ведем ваш проект от начала до успешного запуска',
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: 'Обучение команды',
                  description:
                    'Проводим тренинги по работе с разработанными системами',
                },
                {
                  icon: <Headphones className="w-6 h-6" />,
                  title: 'Постпроектная поддержка',
                  description:
                    'Развиваем и масштабируем проект вместе с вашим бизнесом',
                },
              ].map((item, index) => (
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
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-background rounded-2xl p-6 shadow-2xl max-w-[400px] ml-auto">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <div className="flex -space-x-2">
                  <Avatar className="border-2 border-background">
                    <AvatarFallback>ТП</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarFallback>МП</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarFallback>АВ</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-semibold">Команда поддержки</h3>
                  <p className="text-sm text-muted-foreground">
                    Мы тут и готовы помочь
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary rounded-xl p-4 ml-auto max-w-[80%]">
                  <p className="text-sm">
                    Здравствуйте! Я ваш персональный менеджер проекта.
                  </p>
                </div>
                <div className="bg-muted rounded-xl p-4 max-w-[80%]">
                  <p className="text-sm">
                    Нужна помощь с настройкой нового модуля в CRM...
                  </p>
                </div>
                <div className="bg-primary/10 text-primary rounded-xl p-4 ml-auto max-w-[80%]">
                  <p className="text-sm">
                    Сейчас организую звонок с техническим специалистом для
                    детальной настройки.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
