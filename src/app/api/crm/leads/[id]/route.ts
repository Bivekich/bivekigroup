import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { LeadStatus } from '@/lib/types';

interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
}

// Получение одной заявки
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    const leadId = parseInt(params.id);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'Некорректный идентификатор заявки' },
        { status: 400 }
      );
    }

    // Получаем заявку
    const lead = await prisma.cRMLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    // Проверяем, что заявка принадлежит пользователю
    if (lead.user_id !== decoded.id) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Ошибка при получении заявки:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении заявки' },
      { status: 500 }
    );
  }
}

// Обновление заявки
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const leadId = parseInt(params.id);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'Некорректный идентификатор заявки' },
        { status: 400 }
      );
    }

    // Проверяем существование заявки и ее принадлежность пользователю
    const existingLead = await prisma.cRMLead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    if (existingLead.user_id !== decoded.id) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const data = await req.json();

    // Обновление заявки
    const updatedLead = await prisma.cRMLead.update({
      where: { id: leadId },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        amount: data.amount !== undefined ? parseFloat(data.amount) : undefined,
        status: data.status as LeadStatus,
        comment: data.comment,
      },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Ошибка при обновлении заявки:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении заявки' },
      { status: 500 }
    );
  }
}

// Удаление заявки
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const leadId = parseInt(params.id);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'Некорректный идентификатор заявки' },
        { status: 400 }
      );
    }

    // Проверяем существование заявки и ее принадлежность пользователю
    const existingLead = await prisma.cRMLead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    if (existingLead.user_id !== decoded.id) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    // Удаление заявки
    await prisma.cRMLead.delete({
      where: { id: leadId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении заявки:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении заявки' },
      { status: 500 }
    );
  }
}
