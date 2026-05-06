import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { supabase } from '@/app/lib/supabase';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('sigma_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let user: any;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });

  return NextResponse.json({ requests: data });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('sigma_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let user: any;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { requestType, userType, purpose, urgency, notes } = await req.json();

  if (!requestType || !userType || !purpose) {
    return NextResponse.json({ error: 'Field wajib belum diisi' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('requests')
    .insert([{
      user_id: user.id,
      user_type: userType,
      request_type: requestType,
      purpose,
      urgency: urgency || 'normal',
      notes: notes || null,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ request: data });
}
