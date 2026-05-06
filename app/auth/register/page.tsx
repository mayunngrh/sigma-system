'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) { setError('Nama lengkap harus diisi'); return false; }
    if (!formData.username.trim()) { setError('Username harus diisi'); return false; }
    if (formData.username.includes(' ')) { setError('Username tidak boleh mengandung spasi'); return false; }
    if (!formData.phoneNumber.trim()) { setError('Nomor telepon harus diisi'); return false; }
    if (formData.password.length < 6) { setError('Kata sandi minimal 6 karakter'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Kata sandi tidak cocok'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signUp(formData.username, formData.password, formData.fullName, formData.phoneNumber);
      router.push('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
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
            <h1 className="text-3xl font-bold text-[#1a2332] mb-2">Daftar Akun</h1>
            <p className="text-gray-600">Buat akun baru untuk mengakses SIGMA</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="fullName" value={formData.fullName}
                onChange={handleInputChange} placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="username" value={formData.username}
                onChange={handleInputChange} placeholder="Contoh: john_doe (tanpa spasi)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">Digunakan untuk login. Tidak bisa diubah.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" name="phoneNumber" value={formData.phoneNumber}
                onChange={handleInputChange} placeholder="Contoh: 08123456789"
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
                onChange={handleInputChange} placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleInputChange} placeholder="Masukkan kembali kata sandi Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
                disabled={loading}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full px-6 py-3 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-[#0d8b8b] hover:text-[#066b6b] font-semibold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
