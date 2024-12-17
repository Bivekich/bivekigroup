'use client';

import { motion } from 'framer-motion';
import { Plus, ArrowRight, MessageSquare, Mail, Send } from 'lucide-react';

export function CrmSection() {
  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'CRM-система',
      description:
        'Заявки сразу попадают в панель управления с автоматическим созданием сделок',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'E-mail уведомления',
      description: 'Получайте уведомления о новых заявках на любой email-адрес',
    },
    {
      icon: <Send className="w-5 h-5" />,
      title: 'Telegram-бот',
      description: 'Мгновенные оповещения о заявках прямо в Telegram-чат',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-block bg-primary px-4 py-1 rounded-full text-sm font-medium text-primary-foreground">
            Скоро в Biveki Group
          </div>
        </motion.div>

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
                Выберите способ
                <br />
                получения заявок
              </h2>
              <p className="text-xl text-muted-foreground">
                Настройте удобный для вас способ получения заявок — через
                CRM-систему, на email или в Telegram. Все заявки будут
                автоматически обрабатываться выбранным способом.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-background rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Заявки</h3>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить заявку
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Разработка сайта',
                    status: 'Новая',
                    amount: '150 000 ₽',
                  },
                  {
                    title: 'Внедрение CRM',
                    status: 'В работе',
                    amount: '80 000 ₽',
                  },
                  {
                    title: 'Интеграция API',
                    status: 'Завершено',
                    amount: '60 000 ₽',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {item.status}
                        </span>
                      </div>
                      <span className="text-sm text-primary font-medium">
                        {item.amount}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-sm text-primary font-medium flex items-center gap-2 mx-auto hover:opacity-80 transition-opacity">
                  Смотреть все заявки
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
