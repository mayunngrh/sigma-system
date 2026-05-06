import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { supabase } from '@/app/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;

  const token = req.cookies.get('sigma_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let user: any;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('result_files')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch result files error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ files: data || [] });
}
