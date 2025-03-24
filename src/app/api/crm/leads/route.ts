import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import type { Prisma } from '@prisma/client';
import { LeadStatus } from '@/lib/types';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

// Получение списка заявок
export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Получаем параметры запроса
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status');
    const searchQuery = url.searchParams.get('search');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    // Параметры пагинации
    const pageParam = url.searchParams.get('page');
    const pageSizeParam = url.searchParams.get('pageSize');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
    const skip = (page - 1) * pageSize;

    // Базовые параметры запроса
    const whereClause: Prisma.CRMLeadWhereInput = { user_id: decoded.id };

    // Фильтрация по статусу
    if (statusFilter && statusFilter !== 'all') {
      whereClause.status = statusFilter as LeadStatus;
    }

    // Поиск по имени, телефону или email
    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { phone: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Фильтрация по дате
    if (dateFrom || dateTo) {
      whereClause.created_at = {};

      if (dateFrom) {
        whereClause.created_at.gte = new Date(dateFrom);
      }

      if (dateTo) {
        // Добавляем 1 день к конечной дате, чтобы включить весь день
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        whereClause.created_at.lt = endDate;
      }
    }

    // Получение общего количества заявок для пагинации
    const total = await prisma.cRMLead.count({
      where: whereClause,
    });

    // Получение заявок с учетом фильтров и пагинации
    const leads = await prisma.cRMLead.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      take: pageSize,
      skip: skip,
    });

    // Получение статистики по статусам
    const statusCounts = await prisma.cRMLead.groupBy({
      by: ['status'],
      where: { user_id: decoded.id },
      _count: {
        status: true,
      },
    });

    // Преобразуем в удобный формат для фронтенда
    const statusStats = statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      leads,
      statusStats,
      total,
    });
  } catch (error) {
    console.error('Ошибка при получении заявок:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении заявок' },
      { status: 500 }
    );
  }
}

// Создание новой заявки
export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    // Проверяем наличие активной подписки
    const subscription = await prisma.cRMSubscription.findUnique({
      where: { user_id: decoded.id },
    });

    const isActive =
      subscription?.active &&
      (!subscription.expires_at ||
        new Date(subscription.expires_at) > new Date());

    if (!subscription || !isActive) {
      return NextResponse.json(
        { error: 'Отсутствует активная подписка на CRM' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Создание заявки
    const lead = await prisma.cRMLead.create({
      data: {
        user_id: decoded.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        amount: data.amount ? parseFloat(data.amount) : null,
        status: data.status || 'new',
        comment: data.comment,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Ошибка при создании заявки:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заявки' },
      { status: 500 }
    );
  }
}
