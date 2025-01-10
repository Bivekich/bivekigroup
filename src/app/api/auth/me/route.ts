import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthServer } from '@/lib/auth.server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await verifyAuthServer(token);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in auth/me:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
