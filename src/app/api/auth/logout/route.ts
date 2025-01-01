import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Выход выполнен успешно' });

  // Удаляем куки токена
  response.cookies.delete('token');

  return response;
}
