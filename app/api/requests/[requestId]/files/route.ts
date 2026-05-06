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

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('request_id', requestId);

  if (error) {
    console.error('Fetch files error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ files: data });
}
