import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { supabase } from '@/app/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const token = req.cookies.get('sigma_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, username, phone_number')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Fetch user error:', error);
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: data.id,
      fullName: data.full_name,
      username: data.username,
      phoneNumber: data.phone_number,
    },
  });
}
