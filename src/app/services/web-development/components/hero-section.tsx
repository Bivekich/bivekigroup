'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/hooks/use-contact-modal';

export function HeroSection() {
  const { open } = useContactModal();

  const scrollToTariffs = () => {
    const tariffsSection = document.getElementById('tariffs');
    if (tariffsSection) {
      tariffsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl font-bold">
              Разработка сайтов для вашего бизнеса
            </h1>
            <p className="text-xl text-muted-foreground">
              Создаем современные веб-сайты с уникальным дизайном, адаптивной
              версткой и удобной системой управления контентом.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={open}>
                Обсудить проект
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToTariffs}>
                Смотреть тарифы
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[16/10] bg-background rounded-lg shadow-lg p-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 ml-4">
                <div className="h-6 bg-muted rounded-md flex items-center px-3">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <div className="h-2 bg-primary/20 rounded w-32 ml-2" />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-8 bg-primary/10 rounded-md"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: '0%', opacity: 0 }}
                      animate={{ width: '100%', opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                      className="h-4 bg-muted rounded"
                    />
                  ))}
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="aspect-square bg-primary/10 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 + i * 0.2 }}
                    className="h-20 bg-muted rounded-md"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
