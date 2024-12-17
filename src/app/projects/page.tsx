'use client';

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
              <Construction className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold">Страница в разработке</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Мы работаем над созданием портфолио наших проектов. Скоро здесь
              появятся интересные кейсы и примеры наших работ.
            </p>
            <div className="bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full inline-block">
              Скоро в Biveki Group
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}