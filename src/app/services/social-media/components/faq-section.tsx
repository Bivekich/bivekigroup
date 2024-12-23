'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection() {
  const faqs = [
    {
      question: 'Как выбираются площадки для размещения?',
      answer:
        'Мы анализируем тематику сообщества, активность аудитории и статистику группы. Подбираем площадки, где находится ваша целевая аудитория, учитывая ваш бюджет и задачи.',
    },
    {
      question: 'Сколько стоит размещение рекламы?',
      answer:
        'Стоимость зависит от выбранных площадок. Есть группы с ценой от 500 рублей за пост. Мы подберем оптимальные варианты под ваш бюджет и поможем эффективно его распределить.',
    },
    {
      question: 'Как быстро будет размещена реклама?',
      answer:
        'После согласования площадок и рекламных материалов, размещение происходит в течение 1-2 рабочих дней. При необходимости можем помочь с подготовкой контента.',
    },
    {
      question: 'Какие гарантии эффективности?',
      answer:
        'Мы предоставляем статистику по каждому размещению - охват, количество переходов и активность. Работаем только с проверенными площадками, где гарантированно есть живая активная аудитория.',
    },
    {
      question: 'Нужно ли предоставлять готовый контент?',
      answer:
        'Не обязательно. Мы можем помочь с подготовкой текста и визуальных материалов для публикации. Также можем адаптировать ваши существующие материалы под формат площадки.',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Частые вопросы</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Отвечаем на популярные вопросы о размещении рекламы в социальных
            сетях
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
