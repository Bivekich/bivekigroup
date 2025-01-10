import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    const text = `
🔔 Новая заявка на обсуждение проекта

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone}
💬 Сообщение:
${message || 'Не указано'}
    `;

    const sent = await sendTelegramMessage(text);

    if (!sent) {
      throw new Error('Failed to send Telegram message');
    }

    return NextResponse.json(
      { message: 'Заявка успешно отправлена' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { message: 'Ошибка при отправке заявки' },
      { status: 500 }
    );
  }
}
