'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username dan kata sandi harus diisi');
      return;
    }
    setLoading(true);
    try {
      await signIn(formData.username, formData.password);
      router.push('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d8b8b]/10 to-[#b8d400]/10 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/images/sigma-logo.png" alt="SIGMA Logo" width={200} height={60} priority className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-[#1a2332] mb-2">Masuk ke SIGMA</h1>
            <p className="text-gray-600">Kelola dokumen akademik Anda dengan mudah</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="username" value={formData.username}
                onChange={handleInputChange} placeholder="Masukkan username Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleInputChange} placeholder="Masukkan kata sandi Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
                disabled={loading}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full px-6 py-3 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-[#0d8b8b] hover:text-[#066b6b] font-semibold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
