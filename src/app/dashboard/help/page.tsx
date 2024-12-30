'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, User, Bell, Globe, HelpCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface Category {
  title: string;
  icon: LucideIcon;
  questions: {
    q: string;
    a: string;
  }[];
}

const categories: Category[] = [
  {
    title: 'Главная страница',
    icon: Home,
    questions: [
      {
        q: 'Что отображается на главной странице?',
        a: 'На главной странице вы найдете обзор всех доступных сервисов, их текущий статус, системный статус с информацией о работоспособности всех компонентов, последние уведомления о важных обновлениях и изменениях в системе.',
      },
      {
        q: 'Как получить доступ к сервисам?',
        a: 'Для активных сервисов доступна кнопка "Открыть", которая перенаправит вас в соответствующий раздел. Сервисы в разработке помечены специальным статусом и датой запуска.',
      },
    ],
  },
  {
    title: 'Профиль',
    icon: User,
    questions: [
      {
        q: 'Как управлять профилем?',
        a: 'В профиле вы можете просматривать информацию о вашей учетной записи, видеть ваш текущий статус и роль в системе, управлять настройками профиля.',
      },
      {
        q: 'Как выйти из системы?',
        a: 'Для выхода используйте меню профиля в верхней панели, нажав на кнопку с вашим email.',
      },
    ],
  },
  {
    title: 'Уведомления',
    icon: Bell,
    questions: [
      {
        q: 'Где посмотреть уведомления?',
        a: 'Все уведомления доступны через иконку колокольчика в верхней панели. Два последних уведомления также отображаются на главной странице.',
      },
      {
        q: 'Какие уведомления я получаю?',
        a: 'Вы получаете важные обновления о системе и ваших сервисах. Для каждого уведомления отображается время его получения.',
      },
    ],
  },
  {
    title: 'Сайты',
    icon: Globe,
    questions: [
      {
        q: 'Как просматривать мои сайты?',
        a: 'В разделе "Сайты" доступен список всех ваших сайтов с их текущим статусом. Вы можете видеть, какие сайты активны, а какие находятся в разработке.',
      },
      {
        q: 'Как отслеживать статус сайта?',
        a: 'Каждый сайт имеет индикатор статуса. Вы также получаете уведомления об изменениях статуса ваших сайтов.',
      },
    ],
  },
];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? categories.filter((category) => category.title === selectedCategory)
    : categories;

  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">База знаний</h1>
        <p className="text-muted-foreground">
          Ответы на часто задаваемые вопросы и документация по сервисам
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.title}
              className={`cursor-pointer transition-colors hover:border-primary/50 ${
                selectedCategory === category.title ? 'border-primary' : ''
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.title ? null : category.title
                )
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {category.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {category.questions.length} вопросов
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.questions.map((q, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <h3 className="font-medium">{q.q}</h3>
                  </div>
                  <p className="text-muted-foreground ml-7">{q.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
