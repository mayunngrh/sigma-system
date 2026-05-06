import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('sigma_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
