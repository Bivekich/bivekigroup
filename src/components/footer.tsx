'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Footer() {
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-muted/30 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12"
        >
          {/* Контакты */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Контакты</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <motion.li
                variants={itemAnimation}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <a
                  href="tel:+79611177205"
                  className="hover:text-primary transition-colors"
                >
                  +7 (961) 117-72-05
                </a>
              </motion.li>
              <motion.li
                variants={itemAnimation}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:developer@biveki.ru"
                  className="hover:text-primary transition-colors break-all"
                >
                  developer@biveki.ru
                </a>
              </motion.li>
              <motion.li
                variants={itemAnimation}
                className="flex items-start gap-2"
              >
                <MapPin className="w-4 h-4 shrink-0 mt-1" />
                <span>Иваново, Россия</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Страницы сайта */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Страницы сайта
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['/', 'Главная'],
                ['/services', 'Услуги'],
                ['/projects', 'Проекты'],
                ['/blog', 'Блог'],
              ].map(([href, title]) => (
                <motion.li key={href} variants={itemAnimation}>
                  <Link
                    href={href}
                    className="hover:text-primary transition-colors"
                  >
                    {title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Дополнительно */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Дополнительно
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <motion.li variants={itemAnimation}>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Личный кабинет
                </Link>
              </motion.li>
              <motion.li variants={itemAnimation}>
                <ThemeToggle />
              </motion.li>
            </ul>
          </motion.div>

          {/* Документы */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Документы</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['/privacy', 'Политика конфиденциальности'],
                ['/terms', 'Пользовательское соглашение'],
                ['/legal', 'Юридическая информация'],
              ].map(([href, title]) => (
                <motion.li key={href} variants={itemAnimation}>
                  <Link
                    href={href}
                    className="hover:text-primary transition-colors"
                  >
                    {title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t pt-6 sm:pt-8"
        >
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2">
              © 2024 Biveki Group. ИП ДАНИЛОВ ЛЕВ ИЛЬИЧ, ИНН 370230592107
            </p>
            <p className="text-xs">
              Обращаем ваше внимание на то, что данный сайт носит исключительно
              информационный характер и ни при каких условиях не является
              публичной офертой, определяемой положениями Статьи 437 (2)
              Гражданского кодекса РФ.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
