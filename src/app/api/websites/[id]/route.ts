import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
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
    const currentWebsiteResult = await pool.query(
      'SELECT w.*, u.email as client_email FROM websites w JOIN users u ON w.client_id = u.id WHERE w.id = $1',
      [websiteId]
    );

    if (currentWebsiteResult.rows.length === 0) {
      return NextResponse.json({ message: 'Сайт не найден' }, { status: 404 });
    }

    const currentWebsite = currentWebsiteResult.rows[0];

    // Если меняется клиент, получаем email нового клиента
    let newClientEmail = null;
    if (client_id && client_id !== currentWebsite.client_id) {
      const newClientResult = await pool.query(
        'SELECT email FROM users WHERE id = $1 AND role = $2',
        [client_id, 'client']
      );
      if (newClientResult.rows.length === 0) {
        return NextResponse.json(
          { message: 'Новый клиент не найден' },
          { status: 404 }
        );
      }
      newClientEmail = newClientResult.rows[0].email;
    }

    // Обновляем данные сайта
    const result = await pool.query(
      'UPDATE websites SET name = COALESCE($1, name), domain = COALESCE($2, domain), status = COALESCE($3, status), client_id = COALESCE($4, client_id) WHERE id = $5 RETURNING *',
      [name, domain, status, client_id, websiteId]
    );

    // Собираем все изменения для уведомления
    const changes: WebsiteChanges = {};
    if (name && name !== currentWebsite.name) changes.name = name;
    if (domain && domain !== currentWebsite.domain) changes.domain = domain;
    if (status && status !== currentWebsite.status) changes.status = status;

    // Отправляем уведомление, если есть какие-либо изменения
    if (Object.keys(changes).length > 0) {
      await sendWebsiteUpdateEmail(currentWebsite.client_email, {
        name: name || currentWebsite.name,
        domain: domain || currentWebsite.domain,
        status: status || currentWebsite.status,
        changes: changes,
      });
    }

    // Отправляем уведомления, если сменился клиент
    if (client_id && client_id !== currentWebsite.client_id && newClientEmail) {
      // Уведомление старому клиенту
      await sendWebsiteUpdateEmail(currentWebsite.client_email, {
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

    return NextResponse.json({ website: result.rows[0] });
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
    const websiteData = await pool.query(
      'SELECT w.*, u.email as client_email FROM websites w JOIN users u ON w.client_id = u.id WHERE w.id = $1',
      [websiteId]
    );

    if (websiteData.rows.length === 0) {
      return NextResponse.json({ message: 'Сайт не найден' }, { status: 404 });
    }

    const website = websiteData.rows[0];

    // Удаляем сайт
    await pool.query('DELETE FROM websites WHERE id = $1', [websiteId]);

    // Отправляем уведомление клиенту
    try {
      await sendWebsiteDeleteEmail(website.client_email, {
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
