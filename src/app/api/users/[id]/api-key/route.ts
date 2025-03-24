import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface JWTPayload {
  id: number;
  role: string;
}

// Проверка доступа к пользовательским данным
async function checkAccess(userId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return false;

  try {
    const payload = verify(token.value, process.env.JWT_SECRET!) as JWTPayload;
    // Админ или владелец аккаунта
    return payload.role === 'admin' || payload.id === userId;
  } catch {
    return false;
  }
}

// Генерация API ключа
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Используем await для params согласно рекомендациям Next.js
  const id = params.id;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: 'Некорректный ID пользователя' },
      { status: 400 }
    );
  }

  const hasAccess = await checkAccess(userId);

  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Нет доступа к этому действию' },
      { status: 403 }
    );
  }

  try {
    // Генерируем уникальный API ключ
    const apiKey = crypto.randomBytes(32).toString('hex');

    // Обновляем пользователя с новым API ключом
    await prisma.user.update({
      where: { id: userId },
      data: { api_key: apiKey },
    });

    return NextResponse.json({ api_key: apiKey });
  } catch (error) {
    console.error('Ошибка при генерации API ключа:', error);
    return NextResponse.json(
      { error: 'Не удалось сгенерировать API ключ' },
      { status: 500 }
    );
  }
}
