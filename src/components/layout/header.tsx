'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';
import { MobileNav } from './mobile-nav';

const navItems = [
  { href: '/', label: 'Главная' },
  { href: '/services', label: 'Услуги' },
  { href: '/projects', label: 'Проекты' },
  { href: '/blog', label: 'Блог' },
];

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <MobileNav />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Biveki Group</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium relative after:absolute after:left-0 after:bottom-[-8px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 sm:gap-4"
        >
          <ThemeToggle />
          <Link href="/login">
            <Button
              variant="default"
              className="transition-transform hover:scale-105 hidden sm:inline-flex"
            >
              Войти
            </Button>
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
