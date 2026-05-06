'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FileText, Download, Upload, AlertCircle, MessageCircle } from 'lucide-react';

interface Request {
  id: string;
  user_id: string;
  user_type: string;
  request_type: string;
  purpose: string;
  urgency: string;
  notes: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface ResultFile {
  id: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  created_at: string;
}

interface User {
  id: string;
  fullName: string;
  username: string;
  phoneNumber: string | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
  perbaikan: { label: 'Perbaikan', color: 'bg-orange-100 text-orange-800' },
};

const formatRequestType = (type: string) =>
  type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function AdminRequestDetail() {
  const router = useRouter();
  const params = useParams();
  const requestId = (params?.requestId as string) || '';
  const queryClient = useQueryClient();

  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { data: request, isLoading } = useQuery({
    queryKey: ['admin-request', requestId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/requests/${requestId}`);
      if (!res.ok) throw new Error('Gagal memuat detail permintaan');
      const data = await res.json();
      return data.request as Request;
    },
    enabled: !!requestId,
  });

  if (request && !initialized) {
    setStatus(request.status);
    setAdminNotes(request.admin_notes || '');
    setInitialized(true);
  }

  const { data: resultFiles = [] } = useQuery({
    queryKey: ['admin-result-files', requestId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/requests/${requestId}/result-files`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.files as ResultFile[];
    },
    enabled: !!requestId,
  });

  const { data: supportFiles = [] } = useQuery({
    queryKey: ['request-files', requestId],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${requestId}/files`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.files || [];
    },
    enabled: !!requestId,
  });

  const { data: user } = useQuery({
    queryKey: ['user', request?.user_id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${request?.user_id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.user as User;
    },
    enabled: !!request?.user_id,
  });

  const updateMutation = useMutation({
    mutationFn: async (newStatus?: string) => {
      const formData = new FormData();
      formData.append('status', newStatus || status);
      formData.append('adminNotes', adminNotes);
      if (resultFile) formData.append('resultFile', resultFile);

      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal memperbarui permintaan');
      return res.json();
    },
    onSuccess: async () => {
      setResultFile(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-result-files', requestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('Ukuran file tidak boleh lebih dari 5MB');
        return;
      }
      setResultFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0d8b8b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Memuat detail permintaan...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Permintaan tidak ditemukan</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-medium transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  const statusOption = statusConfig[status] || statusConfig.pending;
  const currentStatus = statusConfig[request.status] || statusConfig.pending;

  return (
    <div className="space-y-6 p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="text-[#0d8b8b] hover:text-[#066b6b] font-medium text-sm mb-2"
          >
            ← Kembali
          </button>
          <h1 className="text-4xl font-bold text-[#1a2332]">Detail Permintaan (Admin)</h1>
          <p className="text-gray-600 mt-1">{formatRequestType(request.request_type)}</p>
        </div>
        <span className={`px-6 py-3 rounded-full text-sm font-semibold ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">Informasi Permintaan</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500 font-medium">Jenis Permintaan</label>
                <p className="text-[#1a2332] font-semibold mt-2">{formatRequestType(request.request_type)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 font-medium">Tujuan</label>
                <p className="text-[#1a2332] font-semibold mt-2">{request.purpose}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 font-medium">Catatan Pemohon</label>
                <p className="text-[#1a2332] font-semibold mt-2">{request.notes || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 font-medium">Tanggal Permintaan</label>
                <p className="text-[#1a2332] font-semibold mt-2">
                  {new Date(request.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">Catatan Admin</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk pemohon..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] focus:ring-2 focus:ring-[#0d8b8b]/20 resize-none"
            />
            <button
              onClick={() => setShowConfirm(true)}
              disabled={updateMutation.isPending || !adminNotes.trim()}
              className="w-full mt-4 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Mengirim...' : 'Kirim Catatan'}
            </button>
          </div>

          {/* Support Files */}
          {supportFiles.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#1a2332] mb-6">File Pendukung dari Pemohon</h2>
              <div className="space-y-3">
                {supportFiles.map((file: any) => (
                  <a
                    key={file.id}
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/request-files/${file.storage_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium text-[#0d8b8b] group-hover:underline">{file.original_filename}</p>
                        <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-[#0d8b8b]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Result File Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">File Hasil / Dokumen Ditandatangani</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload File Hasil (Maksimal 5MB) {resultFile && <span className="text-green-600">✓ File dipilih</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0d8b8b] transition cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="result-file-input"
                />
                <label htmlFor="result-file-input" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-700 font-medium">{resultFile ? resultFile.name : 'Pilih file atau drag and drop'}</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                </label>
              </div>
              {fileError && <p className="text-red-600 text-sm mt-2">{fileError}</p>}
            </div>

            {/* Current Result Files */}
            {resultFiles.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3">File Hasil Saat Ini</h3>
                <div className="space-y-2">
                  {resultFiles.map((file) => (
                    <a
                      key={file.id}
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/result-files/${file.storage_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#0d8b8b]" />
                        <div>
                          <p className="font-medium text-sm text-[#0d8b8b] group-hover:underline">{file.original_filename}</p>
                          <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-[#0d8b8b]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requester Info */}
          {user && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Detail Pengaju</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0d8b8b] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[#1a2332] text-sm">{user.fullName}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
              {user.phoneNumber && (
                <a
                  href={`https://wa.me/${user.phoneNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg transition font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Send Feedback (Perbaikan) Button */}
          {adminNotes.trim() && (
            <div className="bg-orange-50 rounded-lg shadow-sm border border-orange-200 p-6">
              <h3 className="text-sm font-bold text-orange-900 uppercase mb-4">Kirim Feedback</h3>
              <p className="text-sm text-orange-800 mb-4">Status akan berubah menjadi "Perbaikan" ketika Anda mengirim feedback ini.</p>
              <button
                onClick={() => {
                  const newStatus = 'perbaikan';
                  setStatus(newStatus);
                  updateMutation.mutate(newStatus);
                }}
                disabled={updateMutation.isPending}
                className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? 'Mengirim...' : 'Kirim Catatan (Perbaikan)'}
              </button>
            </div>
          )}

          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Ubah Status Manual</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d8b8b] mb-4"
            >
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <button
              onClick={() => updateMutation.mutate(status)}
              disabled={updateMutation.isPending}
              className="w-full px-4 py-3 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {updateMutation.isSuccess && (
              <p className="text-green-600 text-sm mt-2">✓ Berhasil disimpan</p>
            )}
            {updateMutation.isError && (
              <p className="text-red-600 text-sm mt-2">✗ Gagal menyimpan</p>
            )}
          </div>

          {/* Request ID */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">ID Permintaan</h3>
            <p className="text-xs font-mono text-gray-600 break-all">{request.id}</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1a2332] mb-1">Konfirmasi Kirim Catatan</h3>
                <p className="text-sm text-gray-600">Status permintaan akan berubah menjadi <span className="font-semibold text-orange-600">Perbaikan</span>. Lanjutkan?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={updateMutation.isPending}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setStatus('perbaikan');
                  updateMutation.mutate('perbaikan');
                  setShowConfirm(false);
                }}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Mengirim...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
