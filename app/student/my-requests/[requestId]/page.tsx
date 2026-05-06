'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Upload } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/app/lib/auth-context';

interface Request {
  id: string;
  user_type: string;
  request_type: string;
  purpose: string;
  urgency: string;
  notes: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface File {
  id: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  storage_path: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Menunggu',   color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'Diproses',  color: 'bg-blue-100 text-blue-800' },
  completed:   { label: 'Selesai',   color: 'bg-green-100 text-green-800' },
  rejected:    { label: 'Ditolak',   color: 'bg-red-100 text-red-800' },
  perbaikan:   { label: 'Perbaikan', color: 'bg-orange-100 text-orange-800' },
};

const urgencyConfig: Record<string, { label: string; color: string }> = {
  normal: { label: 'Normal',    color: 'text-gray-500' },
  medium: { label: 'Sedang',   color: 'text-yellow-600' },
  urgent: { label: 'Mendesak', color: 'text-red-600' },
};

const formatRequestType = (type: string) =>
  type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const formatUserType = (type: string) => {
  const map: Record<string, string> = {
    mahasiswa: 'Mahasiswa', dosen: 'Dosen',
    tendik: 'Tenaga Kependidikan', alumni: 'Alumni',
  };
  return map[type] || type;
};

export default function RequestDetail() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.requestId as string;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newFile, setNewFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const { data: request, isLoading } = useQuery({
    queryKey: ['request', requestId],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${requestId}`);
      if (!res.ok) throw new Error('Gagal memuat detail permintaan');
      const data = await res.json();
      return data.request as Request;
    },
    enabled: !!requestId,
  });

  const { data: files = [] } = useQuery({
    queryKey: ['request-files', requestId],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${requestId}/files`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.files as File[];
    },
    enabled: !!requestId,
  });

  const { data: resultFiles = [] } = useQuery({
    queryKey: ['result-files', requestId],
    queryFn: async () => {
      const res = await fetch(`/api/requests/${requestId}/result-files`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.files || [];
    },
    enabled: !!requestId,
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('newFile', newFile!);

      const res = await fetch(`/api/requests/${requestId}/revise`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal mengirim file perbaikan');
      return res.json();
    },
    onSuccess: () => {
      setNewFile(null);
      setFileError('');
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['request-files', requestId] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      if (file.size > 500 * 1024) {
        setFileError('Ukuran file tidak boleh lebih dari 500KB');
        return;
      }
      setNewFile(file);
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

  const status = statusConfig[request.status] || statusConfig.pending;
  const urgency = urgencyConfig[request.urgency] || urgencyConfig.normal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="text-[#0d8b8b] hover:text-[#066b6b] font-medium text-sm mb-2"
          >
            ← Kembali
          </button>
          <h1 className="text-4xl font-bold text-[#1a2332]">Detail Permintaan</h1>
          <p className="text-gray-600 mt-1">{formatRequestType(request.request_type)}</p>
        </div>
        <span className={`px-6 py-3 rounded-full text-sm font-semibold ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Umum */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">Informasi Umum</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500 font-medium">Jenis Pengguna</label>
                <p className="text-[#1a2332] font-semibold mt-2">{formatUserType(request.user_type)}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 font-medium">Jenis Permintaan</label>
                <p className="text-[#1a2332] font-semibold mt-2">{formatRequestType(request.request_type)}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 font-medium">Tingkat Urgensi</label>
                <p className={`font-semibold mt-2 ${urgency.color}`}>{urgency.label}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 font-medium">Tanggal Dibuat</label>
                <p className="text-[#1a2332] font-semibold mt-2">
                  {new Date(request.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Tujuan Permintaan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">Tujuan Permintaan</h2>
            <p className="text-[#1a2332] leading-relaxed">{request.purpose}</p>
          </div>

          {/* Catatan Tambahan */}
          {request.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#1a2332] mb-6">Catatan Tambahan</h2>
              <p className="text-[#1a2332] leading-relaxed">{request.notes}</p>
            </div>
          )}

          {/* File Pendukung */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">File Pendukung</h2>

            {files.length > 0 ? (
              <div className="space-y-3">
                {files.map(file => (
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
            ) : (
              <p className="text-gray-400 text-center py-8">Tidak ada file pendukung</p>
            )}
          </div>

          {/* Result Files */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a2332] mb-6">File Hasil</h2>

            {resultFiles.length > 0 ? (
              <div className="space-y-3">
                {resultFiles.map((file: any) => (
                  <a
                    key={file.id}
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/result-files/${file.storage_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-600 shrink-0" />
                      <div>
                        <p className="font-medium text-green-700 group-hover:underline">{file.original_filename}</p>
                        <p className="text-xs text-green-600">{(file.file_size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-green-600 group-hover:text-green-800" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Belum ada file hasil</p>
            )}
          </div>

          {/* Perbaikan File - Show only if status is perbaikan */}
          {request.status === 'perbaikan' && (
            <div className="bg-orange-50 rounded-lg shadow-sm border border-orange-200 p-6">
              <h2 className="text-lg font-bold text-orange-900 mb-6">Perbaiki File</h2>
              <p className="text-sm text-orange-800 mb-4">Admin meminta perbaikan pada file Anda. Silakan upload file yang sudah diperbaiki.</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload File Perbaikan {newFile && <span className="text-green-600">✓ File dipilih</span>}
                </label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-500 transition cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="revision-file-input"
                  />
                  <label htmlFor="revision-file-input" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                    <p className="text-gray-700 font-medium">{newFile ? newFile.name : 'Pilih file atau drag and drop'}</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                  </label>
                </div>
                {fileError && <p className="text-red-600 text-sm mt-2">{fileError}</p>}
              </div>

              <button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending || !newFile}
                className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? 'Mengirim...' : 'Perbaiki File'}
              </button>
              {updateMutation.isSuccess && (
                <p className="text-green-600 text-sm mt-2">✓ File perbaikan berhasil dikirim</p>
              )}
              {updateMutation.isError && (
                <p className="text-red-600 text-sm mt-2">✗ Gagal mengirim file perbaikan</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {user && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Pemohon</h3>
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
                <p className="text-xs text-gray-500">{user.phoneNumber}</p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Status Permintaan</h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>

          {/* Catatan Admin */}
          {request.admin_notes && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-red-900 uppercase mb-3">Catatan Admin</h3>
              <p className="text-red-800 text-sm">{request.admin_notes}</p>
            </div>
          )}

          {/* Request ID */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">ID Permintaan</h3>
            <p className="text-xs font-mono text-gray-600 break-all">{request.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
