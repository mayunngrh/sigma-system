import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { supabase } from '@/app/lib/supabase';
import { randomUUID } from 'crypto';

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
  try {
    const token = req.cookies.get('sigma_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let user: any;
    try {
      user = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await req.formData();
  const requestType = formData.get('requestType') as string;
  const userType = formData.get('userType') as string;
  const purpose = formData.get('purpose') as string;
  const urgency = (formData.get('urgency') as string) || 'normal';
  const notes = formData.get('notes') as string | null;
  const file = formData.get('file') as File | null;

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
      urgency,
      notes: notes || null,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (file) {
    try {
      const fileId = randomUUID();
      const fileName = `${fileId}`;
      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from('request-files')
        .upload(fileName, buffer, { contentType: file.type });

      if (uploadError) {
        console.error('File upload error:', uploadError);
      } else {
        const { error: dbError } = await supabase
          .from('files')
          .insert([{
            id: fileId,
            request_id: data.id,
            original_filename: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: fileName,
          }]);

        if (dbError) {
          console.error('File metadata error:', dbError);
        }
      }
    } catch (fileErr: any) {
      console.error('File handling error:', fileErr);
    }
  }

    return NextResponse.json({ request: data });
  } catch (err: any) {
    console.error('POST /api/requests error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
