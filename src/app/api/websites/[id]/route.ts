import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { sendWebsiteUpdateEmail, sendWebsiteDeleteEmail } from '@/lib/mail';
import { WebsiteChanges } from '@/lib/types';

// Проверка роли администратора
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return false;

  try {
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

// Обновление сайта
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const websiteId = parseInt(params.id);
    const data = await request.json();
    const { name, domain, status, client_id } = data;

    // Получаем текущие данные сайта и клиента
    const currentWebsite = await prisma.websites.findUnique({
      where: { id: websiteId },
      include: {
        users: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!currentWebsite) {
      return NextResponse.json({ message: 'Сайт не найден' }, { status: 404 });
    }

    const currentClientEmail = currentWebsite.users.email;

    // Если меняется клиент, получаем email нового клиента
    let newClientEmail = null;
    if (client_id && client_id !== currentWebsite.client_id) {
      const newClient = await prisma.user.findUnique({
        where: {
          id: client_id,
          role: 'client',
        },
        select: {
          email: true,
        },
      });

      if (!newClient) {
        return NextResponse.json(
          { message: 'Новый клиент не найден' },
          { status: 404 }
        );
      }
      newClientEmail = newClient.email;
    }

    // Обновляем данные сайта
    const updatedWebsite = await prisma.websites.update({
      where: { id: websiteId },
      data: {
        name: name || undefined,
        domain: domain || undefined,
        status: status || undefined,
        client_id: client_id || undefined,
      },
    });

    // Собираем все изменения для уведомления
    const changes: WebsiteChanges = {};
    if (name && name !== currentWebsite.name) changes.name = name;
    if (domain && domain !== currentWebsite.domain) changes.domain = domain;
    if (status && status !== currentWebsite.status) changes.status = status;

    // Отправляем уведомление, если есть какие-либо изменения
    if (Object.keys(changes).length > 0) {
      await sendWebsiteUpdateEmail(currentClientEmail, {
        name: name || currentWebsite.name,
        domain: domain || currentWebsite.domain,
        status: status || currentWebsite.status,
        changes: changes,
      });
    }

    // Отправляем уведомления, если сменился клиент
    if (client_id && client_id !== currentWebsite.client_id && newClientEmail) {
      // Уведомление старому клиенту
      await sendWebsiteUpdateEmail(currentClientEmail, {
        name: currentWebsite.name,
        domain: currentWebsite.domain,
        status: currentWebsite.status,
        changes: {
          ownership: 'removed',
        },
      });

      // Уведомление новому клиенту
      await sendWebsiteUpdateEmail(newClientEmail, {
        name: name || currentWebsite.name,
        domain: domain || currentWebsite.domain,
        status: status || currentWebsite.status,
        changes: {
          ownership: 'added',
        },
      });
    }

    return NextResponse.json({ website: updatedWebsite });
  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json(
      { message: 'Ошибка при обновлении сайта' },
      { status: 500 }
    );
  }
}

// Удаление сайта
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const websiteId = parseInt(params.id);

    // Получаем данные сайта и email клиента перед удалением
    const website = await prisma.websites.findUnique({
      where: { id: websiteId },
      include: {
        users: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!website) {
      return NextResponse.json({ message: 'Сайт не найден' }, { status: 404 });
    }

    const clientEmail = website.users.email;

    // Удаляем сайт
    await prisma.websites.delete({
      where: { id: websiteId },
    });

    // Отправляем уведомление клиенту
    try {
      await sendWebsiteDeleteEmail(clientEmail, {
        name: website.name,
        domain: website.domain,
      });
    } catch (emailError) {
      console.error('Error sending website deletion notification:', emailError);
    }

    return NextResponse.json(
      { message: 'Сайт успешно удален' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении сайта:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
