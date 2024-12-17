'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useContactModal } from '@/hooks/use-contact-modal';
import Link from 'next/link';

export function HeroBanner() {
  const { open } = useContactModal();

  const AnimatedIllustration = ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1],
      }}
      className={`relative ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-primary/10 rounded-full"
      />

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-[10%] left-[10%] bg-background p-3 sm:p-4 rounded-lg shadow-lg w-[140px] sm:w-[200px]"
      >
        <div className="flex gap-1.5 mb-2">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500" />
        </div>
        <div className="space-y-2">
          <div className="h-1.5 sm:h-2 bg-primary/20 rounded w-3/4" />
          <div className="h-1.5 sm:h-2 bg-primary/20 rounded w-1/2" />
          <div className="h-1.5 sm:h-2 bg-primary/20 rounded w-2/3" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-[10%] right-[10%] bg-background p-3 sm:p-4 rounded-lg shadow-lg w-[160px] sm:w-[240px]"
      >
        <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/20" />
          <div className="h-1.5 sm:h-2 bg-primary/20 rounded w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 sm:h-12 bg-primary/10 rounded" />
          <div className="h-8 sm:h-12 bg-primary/10 rounded" />
          <div className="h-8 sm:h-12 bg-primary/10 rounded" />
          <div className="h-8 sm:h-12 bg-primary/10 rounded" />
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/30 rounded-lg"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/30 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 md:gap-12 py-12 md:py-16 lg:py-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col gap-6 md:gap-8 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight"
            >
              <span className="block">Создаем сайты</span>
              <span className="block mt-1 sm:mt-2">для вашего бизнеса</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-[90%] sm:max-w-[80%] md:max-w-[70%] mx-auto lg:mx-0"
            >
              Создаем инновационные веб-сайты и приложения, которые помогают
              бизнесу расти в цифровую эпоху
            </motion.p>
            <motion.div className="lg:hidden h-[250px] sm:h-[300px] w-full">
              <AnimatedIllustration className="h-full" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="transition-transform hover:scale-105"
                onClick={open}
              >
                Обсудить проект
              </Button>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-transform hover:scale-105"
                >
                  Наши услуги
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block h-[400px]">
            <AnimatedIllustration className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
