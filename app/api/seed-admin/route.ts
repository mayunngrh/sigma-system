import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'adminSigmaPoltekkes')
      .single();

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin user already exists' }, { status: 200 });
    }

    const { error } = await supabase.from('users').insert([{
      username: 'adminSigmaPoltekkes',
      password_hash: '$2b$10$2.3rJVr2A7Bg8OI0C.bINe5OMV12L0NCJtgR8A/3fdM4TSEfaks02',
      full_name: 'Admin SIGMA Poltekkes',
      phone_number: '0800000000',
      role: 'admin',
    }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Admin user created successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
