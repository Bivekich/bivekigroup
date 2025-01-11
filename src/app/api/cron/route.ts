import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
  try {
    const headersList = await headers();
    const cronSecret = headersList.get('x-cron-secret');

    // Проверяем секретный ключ
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Запускаем списание средств
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cloud/balance/charge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Ошибка при списании средств:', data.error);
      throw new Error(data.error || 'Failed to charge balance');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
