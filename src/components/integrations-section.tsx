'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Phone,
  Truck,
  BarChart3,
  CreditCard,
  Share2,
  LineChart,
} from 'lucide-react';

const integrations = [
  {
    name: 'CRM системы',
    icon: <MessageSquare className="w-8 h-8" />,
  },
  {
    name: 'Telegram',
    icon: <Send className="w-8 h-8" />,
  },
  {
    name: 'Телефония',
    icon: <Phone className="w-8 h-8" />,
  },
  {
    name: 'Доставка',
    icon: <Truck className="w-8 h-8" />,
  },
  {
    name: 'Яндекс Метрика',
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    name: 'Оплата',
    icon: <CreditCard className="w-8 h-8" />,
  },
  {
    name: 'Соцсети',
    icon: <Share2 className="w-8 h-8" />,
  },
  {
    name: 'Google Analytics',
    icon: <LineChart className="w-8 h-8" />,
  },
];

export function IntegrationsSection() {
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
          <h2 className="text-4xl font-bold mb-4">Интеграции и расширения</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Подключаем популярные сервисы для эффективной работы вашего бизнеса:
            CRM-системы, мессенджеры, системы аналитики и платежные сервисы.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                {integration.icon}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {integration.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
