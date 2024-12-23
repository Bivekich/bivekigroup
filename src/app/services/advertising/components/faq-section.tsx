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
      question: 'Сколько времени нужно для запуска рекламной кампании?',
      answer:
        'Базовую рекламную кампанию мы можем запустить в течение 2-3 рабочих дней. Для более сложных проектов с глубокой аналитикой и множеством объявлений может потребоваться 5-7 дней.',
    },
    {
      question: 'Какой минимальный рекламный бюджет?',
      answer:
        'Минимальный рекомендуемый бюджет зависит от вашей ниши и конкуренции. Для старта обычно достаточно 30 000 рублей в месяц, включая стоимость рекламы и нашего сопровождения.',
    },
    {
      question: 'Как происходит оплата рекламных кампаний?',
      answer:
        'Оплата делится на две части: бюджет на рекламу (перечисляется напрямую в рекламные кабинеты) и наше агентское вознаграждение за ведение кампаний.',
    },
    {
      question: 'Предоставляете ли вы отчеты о результатах?',
      answer:
        'Да, мы предоставляем еженедельные и ежемесячные отчеты с основными метриками: количество кликов, стоимость клика, конверсии, ROI и другие важные показатели.',
    },
    {
      question: 'Можно ли изменить рекламный бюджет в процессе работы?',
      answer:
        'Да, бюджет можно корректировать в любой момент. Мы поможем подобрать оптимальный бюджет на основе результатов и ваших целей.',
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Частые вопросы</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Отвечаем на популярные вопросы о рекламных кампаниях
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
