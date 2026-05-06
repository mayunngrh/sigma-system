import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabase';
import { signToken } from '@/app/lib/jwt';

export async function POST(req: NextRequest) {
  const { username, password, fullName, phoneNumber } = await req.json();

  if (!username || !password || !fullName || !phoneNumber) {
    return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name: fullName, username, phone_number: phoneNumber, password_hash: passwordHash, role: 'guest' }])
    .select()
    .single();

  if (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userData = {
    id: data.id,
    fullName: data.full_name,
    username: data.username,
    phoneNumber: data.phone_number,
    role: data.role,
  };

  const token = await signToken(userData);

  const response = NextResponse.json({ user: userData });
  response.cookies.set('sigma_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
