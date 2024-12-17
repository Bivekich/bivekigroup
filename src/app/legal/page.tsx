'use client';

import { motion } from 'framer-motion';
import {
  Building,
  Landmark,
  CreditCard,
  MapPin,
  BadgeInfo,
} from 'lucide-react';

export default function LegalPage() {
  const sections = [
    {
      icon: <Building className="w-6 h-6" />,
      title: 'Основная информация',
      content: [
        {
          label: 'Полное наименование',
          value: 'ДАНИЛОВ ЛЕВ ИЛЬИЧ (ИП)',
        },
        {
          label: 'Сокращённое наименование',
          value: 'ИП ДАНИЛОВ ЛЕВ ИЛЬИЧ',
        },
        {
          label: 'ИНН',
          value: '370230592107',
        },
      ],
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Адрес регистрации',
      content: [
        {
          label: 'Юридический адрес',
          value: 'УЛИЦА 6-Я СОКОЛЬСКАЯ, Д. 10, ИВАНОВСКАЯ ОБЛАСТЬ, Г. ИВАНОВО',
        },
      ],
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: 'Банковские реквизиты',
      content: [
        {
          label: 'Банк',
          value: 'АО "АЛЬФА-БАНК"',
        },
        {
          label: 'ИНН банка',
          value: '7728168971',
        },
        {
          label: 'БИК',
          value: '044525593',
        },
        {
          label: 'Корреспондентский счёт',
          value: '30101810200000000593',
        },
      ],
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Платежная информация',
      content: [
        {
          label: 'Номер счёта',
          value: '40802810980370000166',
        },
        {
          label: 'Валюта',
          value: 'RUR',
        },
      ],
    },
    {
      icon: <BadgeInfo className="w-6 h-6" />,
      title: 'Дополнительная информация',
      content: [
        {
          label: 'Адрес банка',
          value: '153511, ИВАНОВСКАЯ ОБЛАСТЬ, Г. КОХМА, УЛ. ИВАНОВСКАЯ, Д. 29',
        },
      ],
    },
  ];

  return (
    <div className="py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">Юридическая информация</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Полная информация о юридическом лице и банковские реквизиты компании
            Biveki Group
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div
                    key={i}
                    className="grid sm:grid-cols-3 gap-2 text-muted-foreground"
                  >
                    <div className="font-medium text-foreground">
                      {item.label}
                    </div>
                    <div className="sm:col-span-2">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Дата последнего обновления: 18.12.2024
          </p>
        </motion.div>
      </div>
    </div>
  );
}
