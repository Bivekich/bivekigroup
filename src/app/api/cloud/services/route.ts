import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendEmail } from '@/lib/mail';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Если админ - возвращаем все услуги, иначе только услуги пользователя
    let services;

    if (user.role === 'admin') {
      services = await prisma.cloudService.findMany({
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Преобразуем данные в формат, совместимый с предыдущим API
      services = services.map((service) => ({
        ...service,
        user_email: service.user.email,
        user: undefined,
      }));
    } else {
      services = await prisma.cloudService.findMany({
        where: {
          user_id: user.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Ошибка при получении списка услуг:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, type, description, price, userId } = await req.json();

    // Получаем email клиента
    const client = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { email: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const clientEmail = client.email;

    // Создаем услугу
    const service = await prisma.cloudService.create({
      data: {
        name,
        type,
        description,
        price,
        user_id: Number(userId),
        status: 'active',
      },
    });

    // Отправляем уведомление в Telegram
    const message = `
🆕 Новая услуга добавлена
👤 Клиент: ${clientEmail}
📦 Услуга: ${name}
💵 Стоимость: ${price} ₽/день
    `;

    await sendTelegramMessage(message);

    // Отправляем уведомление на почту клиенту
    try {
      await sendEmail({
        to: clientEmail,
        subject: 'Новая услуга добавлена',
        html: `
          <h2>Добавлена новая услуга</h2>
          <p>Название: <strong>${name}</strong></p>
          <p>Тип: <strong>${type}</strong></p>
          <p>Описание: <strong>${description || 'Не указано'}</strong></p>
          <p>Стоимость: <strong>${price} ₽/день</strong></p>
          <p>Статус: <strong>Активна</strong></p>
          <p>Услуга уже активна и будет тарифицироваться ежедневно. Для управления услугами перейдите в <a href="${
            process.env.NEXT_PUBLIC_APP_URL
          }/dashboard/cloud">личный кабинет</a>.</p>
        `,
      });
    } catch (emailError) {
      console.error('Ошибка при отправке email:', emailError);
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Ошибка при создании услуги:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, status, ...data } = await req.json();

    // Проверяем статус и устанавливаем значение по умолчанию, если не указан
    const validStatuses = ['active', 'suspended', 'terminated'];
    const serviceStatus =
      status && validStatuses.includes(status) ? status : 'active';

    // Обновляем услугу
    const service = await prisma.cloudService.update({
      where: { id: Number(id) },
      data: {
        status: serviceStatus,
        name: data.name,
        description: data.description,
        price: data.price,
      },
    });

    // Если услуга приостановлена, отправляем email клиенту
    if (serviceStatus === 'suspended') {
      // Получаем email клиента
      const client = await prisma.user.findUnique({
        where: { id: service.user_id },
        select: { email: true },
      });

      if (client) {
        const clientEmail = client.email;

        await sendEmail({
          to: clientEmail,
          subject: 'Уведомление от BivekiGroup',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Уведомление о приостановке услуги</h2>
              <p>Уведомляем вас о том, что облачная услуга была приостановлена.</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Услуга:</strong> ${service.name}</p>
                <p style="margin: 5px 0;"><strong>Причина:</strong> Недостаточно средств на балансе</p>
              </div>
              <p>Для возобновления работы услуги, пожалуйста, пополните баланс в <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/cloud" style="color: #007bff;">личном кабинете</a>.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
            </div>
          `,
        });
      }

      // Получаем баланс пользователя
      const balance = await prisma.cloudBalance.findUnique({
        where: { user_id: service.user_id },
        select: { amount: true },
      });

      // Отправляем уведомление в Telegram админу
      const message = `
⚠️ Приостановлена облачная услуга
👤 Пользователь: ${client?.email}
📦 Услуга: ${service.name}
💰 Стоимость: ${service.price} ₽/день
💳 Текущий баланс: ${balance?.amount || 0} ₽
      `;

      await sendTelegramMessage(message);
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Ошибка при обновлении услуги:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
