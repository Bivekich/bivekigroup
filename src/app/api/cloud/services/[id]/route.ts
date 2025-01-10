import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';
import { pool } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await verifyAuthServer(token);

    if (!user || user.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Получаем информацию об услуге перед удалением
    const serviceResult = await pool.query(
      'SELECT cs.*, u.email as user_email FROM cloud_services cs JOIN users u ON cs.user_id = u.id WHERE cs.id = $1',
      [parseInt(params.id)]
    );

    if (serviceResult.rows.length === 0) {
      return new NextResponse('Service not found', { status: 404 });
    }

    const service = serviceResult.rows[0];

    // Удаляем услугу
    await pool.query('DELETE FROM cloud_services WHERE id = $1', [
      parseInt(params.id),
    ]);

    // Отправляем уведомление в Telegram
    await sendTelegramMessage(
      `🗑 Услуга удалена\n\nУслуга: ${service.name}\nКлиент: ${service.user_email}\nСтоимость: ${service.price} ₽/день`
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CLOUD_SERVICE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
