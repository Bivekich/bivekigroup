import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

// Валидация API-ключа
const validateApiKey = async (
  apiKey: string | null
): Promise<number | null> => {
  if (!apiKey) return null;

  try {
    const user = await prisma.user.findFirst({
      where: { api_key: apiKey },
      select: { id: true },
    });

    return user?.id || null;
  } catch (error) {
    console.error('Ошибка при проверке API ключа:', error);
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    const userId = await validateApiKey(apiKey);

    if (!userId) {
      return NextResponse.json({ error: 'Неверный API ключ' }, { status: 401 });
    }

    // Проверяем наличие активной подписки
    const subscription = await prisma.cRMSubscription.findUnique({
      where: { user_id: userId },
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

    // Валидация полей
    if (!data.name) {
      return NextResponse.json(
        { error: 'Имя клиента обязательно' },
        { status: 400 }
      );
    }

    // Создание заявки
    const lead = await prisma.cRMLead.create({
      data: {
        user_id: userId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        amount: data.amount ? parseFloat(data.amount) : null,
        status: (data.status as LeadStatus) || 'new',
        comment: data.comment || 'Заявка из внешнего API',
        source: data.source || 'external_api',
      },
    });

    return NextResponse.json(
      {
        success: true,
        lead_id: lead.id,
        message: 'Заявка успешно создана',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при создании заявки:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заявки' },
      { status: 500 }
    );
  }
}
