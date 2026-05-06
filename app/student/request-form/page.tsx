'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const userTypes = [
  { value: 'mahasiswa', label: 'Mahasiswa' },
  { value: 'dosen', label: 'Dosen' },
  { value: 'tendik', label: 'Tenaga Kependidikan' },
  { value: 'alumni', label: 'Alumni' },
];

const requestTypesByUserType: Record<string, { value: string; label: string }[]> = {
  mahasiswa: [
    { value: 'surat_keterangan_kuliah', label: 'Surat Keterangan Kuliah' },
    { value: 'surat_izin_penelitian', label: 'Surat Izin Penelitian' },
    { value: 'surat_dispensasi', label: 'Surat Dispensasi' },
    { value: 'surat_rekomendasi', label: 'Surat Rekomendasi' },
    { value: 'form_beasiswa', label: 'Form Beasiswa' },
    { value: 'surat_cuti_akademik', label: 'Surat Cuti Akademik' },
    { value: 'lainnya', label: 'Lainnya' },
  ],
  dosen: [
    { value: 'surat_tugas_mengajar', label: 'Surat Tugas Mengajar' },
    { value: 'surat_tugas_penelitian', label: 'Surat Tugas Penelitian' },
    { value: 'lainnya', label: 'Lainnya' },
  ],
  tendik: [
    { value: 'surat_tugas', label: 'Surat Tugas' },
    { value: 'lainnya', label: 'Lainnya' },
  ],
  alumni: [
    { value: 'info_lowongan_kerja', label: 'Info Lowongan Kerja' },
    { value: 'surat_keterangan_lulus', label: 'Surat Keterangan Lulus' },
    { value: 'lainnya', label: 'Lainnya' },
  ],
};

export default function RequestForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userType: '',
    requestType: '',
    purpose: '',
    urgency: 'normal',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'userType') {
      setFormData(prev => ({ ...prev, userType: value, requestType: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.userType) { setError('Pilih jenis pengguna'); return; }
    if (!formData.requestType) { setError('Pilih jenis permintaan'); return; }
    if (!formData.purpose.trim()) { setError('Tujuan permintaan harus diisi'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: formData.userType,
          requestType: formData.requestType,
          purpose: formData.purpose,
          urgency: formData.urgency,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengajukan permintaan');

      setSubmitted(true);
      setTimeout(() => router.push('/student/my-requests'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableRequestTypes = formData.userType ? requestTypesByUserType[formData.userType] : [];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a2332] mb-2">Buat Permintaan Baru</h1>
        <p className="text-gray-600">Ajukan permintaan surat akademik dengan mudah dan cepat</p>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <p className="font-semibold text-green-900">Permintaan Berhasil Diajukan!</p>
            <p className="text-sm text-green-700 mt-1">Mengalihkan ke halaman permintaan saya...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">

          {/* User Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Anda Sebagai <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {userTypes.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition font-medium text-sm ${
                    formData.userType === type.value
                      ? 'border-[#0d8b8b] bg-[#0d8b8b]/10 text-[#0d8b8b]'
                      : 'border-gray-200 text-gray-600 hover:border-[#0d8b8b]/50'
                  }`}
                >
                  <input
                    type="radio" name="userType" value={type.value}
                    checked={formData.userType === type.value}
                    onChange={handleInputChange} className="hidden"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          {/* Request Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Jenis Permintaan <span className="text-red-500">*</span>
            </label>
            <select
              name="requestType" value={formData.requestType}
              onChange={handleInputChange} disabled={!formData.userType}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{formData.userType ? 'Pilih jenis permintaan...' : 'Pilih jenis pengguna dahulu'}</option>
              {availableRequestTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Tujuan Permintaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="purpose" value={formData.purpose}
              onChange={handleInputChange} placeholder="Jelaskan tujuan permintaan Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
              disabled={loading}
            />
          </div>

          {/* Urgency */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">Tingkat Urgensi</label>
            <div className="flex gap-4">
              {[
                { value: 'normal', label: 'Normal', color: 'text-gray-600' },
                { value: 'medium', label: 'Sedang', color: 'text-yellow-600' },
                { value: 'urgent', label: 'Mendesak', color: 'text-red-600' },
              ].map(level => (
                <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="urgency" value={level.value}
                    checked={formData.urgency === level.value}
                    onChange={handleInputChange} className="w-4 h-4 accent-[#0d8b8b]"
                  />
                  <span className={`text-sm font-medium ${formData.urgency === level.value ? level.color : 'text-gray-500'}`}>
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">Catatan Tambahan</label>
            <textarea
              name="notes" value={formData.notes} onChange={handleInputChange}
              placeholder="Tambahkan catatan atau informasi tambahan jika diperlukan..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20 resize-none"
              disabled={loading}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">📝 Panduan Pengajuan</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pastikan semua informasi yang Anda masukkan sudah benar</li>
            <li>• Waktu proses normal adalah 3-5 hari kerja</li>
            <li>• Anda dapat memantau status permintaan di halaman "Permintaan Saya"</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button" onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit" disabled={loading || submitted}
            className="px-6 py-3 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengajukan...' : 'Ajukan Permintaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
