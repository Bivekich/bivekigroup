const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(data: {
  name: string;
  email: string;
  phone: string;
  tariff: string;
  page: string;
}) {
  const message = `
🔥 Новая заявка с сайта!

👤 Имя: ${data.name}
📧 Email: ${data.email}
📱 Телефон: ${data.phone}
💰 Выбранный тариф: ${data.tariff}
📄 Страница отправки: ${data.page}

🌐 Отправлено с сайта biveki.ru
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send telegram message');
    }

    return true;
  } catch (error) {
    console.error('Error sending telegram message:', error);
    return false;
  }
}
