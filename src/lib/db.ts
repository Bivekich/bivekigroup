import { prisma } from './prisma';
import { Pool } from 'pg';

// Для обеспечения совместимости со старым кодом
// Создаем прокси-объект, который имитирует интерфейс Pool из pg
// но использует Prisma для выполнения запросов
class PrismaPoolProxy {
  async query(text: string, params?: unknown[]) {
    console.log('SQL запрос через Prisma: ', text, params);

    // Этот метод оставляем только для обратной совместимости
    // Новый код должен использовать prisma напрямую
    if (!params) params = [];

    // Возвращаем совместимый с pg результат
    try {
      // Этот проксирующий слой нужен только для миграции
      // В дальнейшем весь код должен использовать prisma напрямую
      throw new Error('Используйте prisma напрямую вместо прямых SQL запросов');
    } catch (error) {
      console.error('Ошибка при выполнении SQL через Prisma:', error);
      throw error;
    }
  }
}

// Для обратной совместимости, оставляем те же имена экспортов
export const db = new PrismaPoolProxy() as unknown as Pool;
export const pool = db;

// Экспортируем prisma для использования в новом коде
export { prisma };
