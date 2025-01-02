'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, TrendingUp, LineChart, DollarSign } from 'lucide-react';

export function CaseStudySection() {
  const data = [
    {
      name: 'Неделя 1',
      показы: 24000,
      клики: 890,
    },
    {
      name: 'Неделя 2',
      показы: 31000,
      клики: 1200,
    },
    {
      name: 'Неделя 3',
      показы: 42823,
      клики: 1548,
    },
  ];

  const metrics = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Показов',
      value: '97 823',
      unit: '',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Кликов',
      value: '3 638',
      unit: '',
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      label: 'CTR',
      value: '3.72',
      unit: '%',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Конверсия',
      value: '12.4',
      unit: '%',
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
            Кейс компании по производству и переработке драгоценных металлов:
            как мы привлекли целевых B2B клиентов
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
              <h3 className="font-semibold">Результаты кампании</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                  <span>Показы</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Клики</span>
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-foreground fill-foreground"
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    className="text-foreground fill-foreground"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-foreground fill-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                    }}
                    itemStyle={{
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="показы"
                    fill="hsl(var(--primary) / 0.5)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="клики"
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
