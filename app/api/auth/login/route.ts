import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabase';
import { signToken } from '@/app/lib/jwt';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan kata sandi harus diisi' }, { status: 400 });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Username atau kata sandi salah' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Username atau kata sandi salah' }, { status: 401 });
  }

  const userData = {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    phoneNumber: user.phone_number,
    role: user.role,
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
