import { NextResponse } from 'next/server';

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
${message}
    `;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!telegramResponse.ok) {
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
