import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { supabase } from '@/app/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;

  const token = req.cookies.get('sigma_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const newFile = formData.get('newFile') as File | null;

    if (!newFile) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (newFile.size > 500 * 1024) {
      return NextResponse.json({ error: 'File size must not exceed 500KB' }, { status: 400 });
    }

    // Update request status to pending
    const { error: updateError } = await supabase
      .from('requests')
      .update({
        status: 'pending',
        admin_notes: null,
      })
      .eq('id', requestId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Delete old support files
    const { data: existingFiles } = await supabase
      .from('files')
      .select('id, storage_path')
      .eq('request_id', requestId);

    if (existingFiles && existingFiles.length > 0) {
      for (const file of existingFiles) {
        await supabase.storage.from('request-files').remove([file.storage_path]);
      }

      const { error: deleteError } = await supabase
        .from('files')
        .delete()
        .eq('request_id', requestId);

      if (deleteError) {
        console.error('Error deleting old files:', deleteError);
      }
    }

    // Upload new file
    const { randomUUID } = await import('crypto');
    const fileId = randomUUID();
    const fileName = `${fileId}`;
    const buffer = await newFile.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('request-files')
      .upload(fileName, buffer, { contentType: newFile.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Insert file metadata
    const { error: dbError } = await supabase
      .from('files')
      .insert([{
        id: fileId,
        request_id: requestId,
        original_filename: newFile.name,
        file_size: newFile.size,
        file_type: newFile.type,
        storage_path: fileName,
      }]);

    if (dbError) {
      console.error('File metadata error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PATCH /api/requests/[requestId]/revise error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
