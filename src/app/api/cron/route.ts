import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
  try {
    const headersList = headers();
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
      }
    );

    if (!response.ok) {
      throw new Error('Failed to charge balance');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
