'use client';

import { motion } from 'framer-motion';
import { LineChart, TrendingUp, Users, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function CaseStudySection() {
  const data = [
    {
      name: 'Неделя 1',
      охват: 3000,
      заявки: 8,
    },
    {
      name: 'Неделя 2',
      охват: 4200,
      заявки: 12,
    },
    {
      name: 'Неделя 3',
      охват: 5100,
      заявки: 15,
    },
  ];

  const metrics = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Бюджет',
      value: '10 000',
      unit: '₽/мес',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Охват',
      value: '12 300',
      unit: 'просмотров',
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      label: 'Заявки',
      value: '35',
      unit: 'шт',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Стоимость заявки',
      value: '285',
      unit: '₽',
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Пример успешной рекламной кампании
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Кейс компании AutoKeysShop: как мы привлекли клиентов для бизнеса по
            изготовлению автомобильных ключей через размещения в автомобильных
            сообществах
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* График */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-xl p-6 shadow-lg space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Динамика результатов</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                  <span>Охват</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Заявки</span>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#888888" />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="охват"
                    fill="hsl(var(--primary) / 0.5)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="заявки"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Метрики */}
          <div className="grid sm:grid-cols-2 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 shadow-lg"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {metric.icon}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {metric.label}
                </div>
                <div className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
