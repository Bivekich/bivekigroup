import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    verify(token.value, process.env.JWT_SECRET || 'your-secret-key');
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 401 });
  }
}
