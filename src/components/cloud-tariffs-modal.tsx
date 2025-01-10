'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CloudTariffsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CloudTariffsModal({ isOpen, onClose }: CloudTariffsModalProps) {
  const serverTariffs = [
    {
      name: 'Cloud-15',
      price: 450,
      cpu: '1 x 3.3 ГГц',
      ram: '1 ГБ',
      disk: '15 ГБ',
      network: '1 Гбит/с',
    },
    {
      name: 'Cloud-30',
      price: 825,
      cpu: '1 x 3.3 ГГц',
      ram: '2 ГБ',
      disk: '30 ГБ',
      network: '1 Гбит/с',
    },
    {
      name: 'Cloud-40',
      price: 1275,
      cpu: '2 x 3.3 ГГц',
      ram: '2 ГБ',
      disk: '40 ГБ',
      network: '1 Гбит/с',
    },
    {
      name: 'Cloud-50',
      price: 1500,
      cpu: '2 x 3.3 ГГц',
      ram: '4 ГБ',
      disk: '50 ГБ',
      network: '1 Гбит/с',
    },
    {
      name: 'Cloud-80',
      price: 2475,
      cpu: '4 x 3.3 ГГц',
      ram: '8 ГБ',
      disk: '80 ГБ',
      network: '1 Гбит/с',
    },
    {
      name: 'Cloud-100',
      price: 4200,
      cpu: '8 x 3.3 ГГц',
      ram: '12 ГБ',
      disk: '100 ГБ',
      network: '1 Гбит/с',
    },
    {
      name: 'Cloud-160',
      price: 6300,
      cpu: '8 x 3.3 ГГц',
      ram: '16 ГБ',
      disk: '160 ГБ',
      network: '1 Гбит/с',
    },
  ];

  const dbTariffs = [
    {
      name: 'Cloud DB 1/1/8',
      price: 345,
      cpu: '1 x 3.3 ГГц',
      ram: '1 ГБ',
      disk: '8 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 1/2/20',
      price: 675,
      cpu: '1 x 3.3 ГГц',
      ram: '2 ГБ',
      disk: '20 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 2/2/30',
      price: 1350,
      cpu: '2 x 3.3 ГГц',
      ram: '2 ГБ',
      disk: '30 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 2/4/40',
      price: 2138,
      cpu: '2 x 3.3 ГГц',
      ram: '4 ГБ',
      disk: '40 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 4/8/80',
      price: 3938,
      cpu: '4 x 3.3 ГГц',
      ram: '8 ГБ',
      disk: '80 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 4/12/120',
      price: 5625,
      cpu: '4 x 3.3 ГГц',
      ram: '12 ГБ',
      disk: '120 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 6/12/180',
      price: 7200,
      cpu: '6 x 3.3 ГГц',
      ram: '12 ГБ',
      disk: '180 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
    {
      name: 'Cloud DB 8/16/220',
      price: 8775,
      cpu: '8 x 3.3 ГГц',
      ram: '16 ГБ',
      disk: '220 ГБ',
      backup: 'Ежедневно',
      privateIp: 'Есть',
    },
  ];

  const storageTariffs = {
    disk: '10 ГБ',
    traffic: '119 ₽/месяц',
    outgoingTraffic: '1.5 ₽/ГБ',
    channel: 'Канал 100 Мбит/с',
    access: 'Доступ по S3-протоколу',
  };

  const emailTariffs = {
    price: 150,
    storage: '100 ГБ',
    description: '1 почтовый ящик',
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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-background p-6 shadow-lg rounded-lg mx-auto z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Тарифы облачных услуг</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="servers" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="servers">Сервера</TabsTrigger>
                <TabsTrigger value="databases">Базы данных</TabsTrigger>
                <TabsTrigger value="storage">Хранилище</TabsTrigger>
                <TabsTrigger value="email">Почта</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px] mt-6">
                <TabsContent value="servers" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serverTariffs.map((tariff) => (
                      <div
                        key={tariff.name}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{tariff.name}</h3>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {tariff.price} ₽/мес
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>CPU: {tariff.cpu}</div>
                          <div>RAM: {tariff.ram}</div>
                          <div>Диск: {tariff.disk}</div>
                          <div>Сеть: {tariff.network}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="databases" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dbTariffs.map((tariff) => (
                      <div
                        key={tariff.name}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{tariff.name}</h3>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {tariff.price} ₽/мес
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>CPU: {tariff.cpu}</div>
                          <div>RAM: {tariff.ram}</div>
                          <div>Диск: {tariff.disk}</div>
                          <div>Бэкап: {tariff.backup}</div>
                          <div>Приватный IP: {tariff.privateIp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="storage" className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Тарифы с почасовым биллингом
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div>Диск: {storageTariffs.disk}</div>
                      <div>Исходящий трафик: {storageTariffs.traffic}</div>
                      <div>
                        Исходящий трафик: {storageTariffs.outgoingTraffic}
                      </div>
                      <div>Канал: {storageTariffs.channel}</div>
                      <div>Доступ: {storageTariffs.access}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">
                        {emailTariffs.description}
                      </h3>
                      <div className="font-bold text-lg">
                        {emailTariffs.price} ₽/мес
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      Объем хранилища: {emailTariffs.storage}
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
