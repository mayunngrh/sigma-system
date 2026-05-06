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
    .from('requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (error) {
    console.error('Fetch request error:', error);
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ request: data });
}

export async function PATCH(
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

  try {
    const formData = await req.formData();
    const status = formData.get('status') as string;
    const adminNotes = formData.get('adminNotes') as string;
    const resultFile = formData.get('resultFile') as File | null;

    const { error: updateError } = await supabase
      .from('requests')
      .update({
        status,
        admin_notes: adminNotes || null,
      })
      .eq('id', requestId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (resultFile) {
      const { randomUUID } = await import('crypto');
      const fileId = randomUUID();
      const fileName = `${fileId}`;
      const buffer = await resultFile.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('result-files')
        .upload(fileName, buffer, { contentType: resultFile.type });

      if (!uploadError) {
        const { error: dbError } = await supabase
          .from('result_files')
          .insert([{
            id: fileId,
            request_id: requestId,
            original_filename: resultFile.name,
            file_size: resultFile.size,
            file_type: resultFile.type,
            storage_path: fileName,
          }]);

        if (dbError) {
          console.error('Result file metadata error:', dbError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PATCH /api/admin/requests/[requestId] error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
