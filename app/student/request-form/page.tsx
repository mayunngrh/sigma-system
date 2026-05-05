'use client';

import { useState } from 'react';

export default function RequestForm() {
  const [formData, setFormData] = useState({
    requestType: '',
    purpose: '',
    urgency: 'normal',
    notes: '',
    attachments: [],
  });

  const [submitted, setSubmitted] = useState(false);

  const requestTypes = [
    { value: 'attendance', label: 'Surat Keterangan Kuliah' },
    { value: 'research', label: 'Surat Izin Penelitian' },
    { value: 'dispensation', label: 'Surat Dispensasi' },
    { value: 'recommendation', label: 'Surat Rekomendasi' },
    { value: 'other', label: 'Lainnya' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ requestType: '', purpose: '', urgency: 'normal', notes: '', attachments: [] });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a2332] mb-2">Buat Permintaan Baru</h1>
        <p className="text-gray-600">Ajukan permintaan surat akademik dengan mudah dan cepat</p>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <p className="font-semibold text-green-900">Permintaan Berhasil Diajukan!</p>
            <p className="text-sm text-green-700 mt-1">
              Permintaan Anda telah diterima. Anda akan menerima notifikasi ketika ada update.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Request Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Jenis Permintaan <span className="text-red-500">*</span>
            </label>
            <select
              name="requestType"
              value={formData.requestType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
            >
              <option value="">Pilih jenis permintaan...</option>
              {requestTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Tujuan Permintaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              required
              placeholder="Jelaskan tujuan permintaan Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20"
            />
          </div>

          {/* Urgency */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Tingkat Urgensi
            </label>
            <div className="flex gap-4">
              {['normal', 'medium', 'urgent'].map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#0d8b8b]"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {level === 'normal' ? 'Normal' : level === 'medium' ? 'Sedang' : 'Mendesak'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Catatan Tambahan
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Tambahkan catatan atau informasi tambahan jika diperlukan..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1a2332] mb-2">
              Upload Dokumen Pendukung
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0d8b8b] transition cursor-pointer">
              <div className="text-4xl mb-2">📎</div>
              <p className="text-sm font-medium text-gray-700">Klik atau drag file ke sini</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
              <input
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">📝 Panduan Pengajuan</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pastikan semua informasi yang Anda masukkan sudah benar</li>
            <li>• Lampirkan dokumen pendukung yang relevan jika diperlukan</li>
            <li>• Waktu proses normal adalah 3-5 hari kerja</li>
            <li>• Anda akan menerima notifikasi untuk setiap update</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-medium transition shadow-md"
          >
            Ajukan Permintaan
          </button>
        </div>
      </form>
    </div>
  );
}
