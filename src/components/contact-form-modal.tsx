'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useContactModal } from '../hooks/use-contact-modal';
import { sendTelegramForm } from '@/lib/telegram';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z
    .string()
    .min(11, 'Введите корректный номер телефона')
    .max(12, 'Введите корректный номер телефона')
    .regex(/^[0-9+]+$/, 'Только цифры и знак +'),
});

type FormData = z.infer<typeof formSchema>;

export function ContactFormModal() {
  const { isOpen, close, tariff, page } = useContactModal();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const messageData = {
        ...data,
        tariff: tariff || 'Не указан',
        page: page || window.location.pathname,
      };

      const sent = await sendTelegramForm(messageData);

      if (sent) {
        toast({
          title: 'Заявка отправлена',
          description: 'Мы свяжемся с вами в ближайшее время',
        });
        reset();
        close();
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Не удалось отправить заявку. Попробуйте позже.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg border bg-background p-4 sm:p-6 shadow-lg rounded-lg mx-auto z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Обсудить проект
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={close}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Оставьте свои контактные данные, и мы свяжемся с вами для
                обсуждения деталей проекта
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Как вас зовут?
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Введите ваше имя"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.ru"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  Телефон
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  {...register('phone')}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 sm:pt-6">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Отправить
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
