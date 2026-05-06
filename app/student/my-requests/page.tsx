'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Menunggu',  color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  completed:   { label: 'Selesai',  color: 'bg-green-100 text-green-800' },
  rejected:    { label: 'Ditolak',  color: 'bg-red-100 text-red-800' },
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

export default function MyRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/requests')
      .then(res => {
        if (res.status === 401) { router.push('/auth/login'); return null; }
        return res.json();
      })
      .then(data => { if (data) setRequests(data.requests || []); })
      .catch(() => setError('Gagal memuat data permintaan'))
      .finally(() => setLoading(false));
  }, [router]);

  const counts = {
    total: requests.length,
    active: requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a2332] mb-2">Permintaan Saya</h1>
        <p className="text-gray-600">Kelola dan pantau semua permintaan surat akademik Anda</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'text-[#0d8b8b]' },
          { label: 'Aktif', value: counts.active, color: 'text-yellow-600' },
          { label: 'Selesai', value: counts.completed, color: 'text-green-600' },
          { label: 'Ditolak', value: counts.rejected, color: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a2332]">Daftar Permintaan</h2>
          <button
            onClick={() => router.push('/student/request-form')}
            className="px-4 py-2 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg text-sm font-medium transition"
          >
            + Buat Baru
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Memuat data...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">Belum ada permintaan</p>
            <button
              onClick={() => router.push('/student/request-form')}
              className="px-6 py-3 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-medium transition"
            >
              Buat Permintaan Pertama
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map(request => {
              const status = statusConfig[request.status] || statusConfig.pending;
              const urgency = urgencyConfig[request.urgency] || urgencyConfig.normal;
              return (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-[#1a2332] text-lg">
                          {formatRequestType(request.request_type)}
                        </h3>
                        <span className={`text-xs font-medium ${urgency.color}`}>
                          • {urgency.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatUserType(request.user_type)} — {request.purpose}
                      </p>
                      {request.admin_notes && (
                        <p className="text-xs text-red-600 mt-1 bg-red-50 px-3 py-1 rounded">
                          Catatan admin: {request.admin_notes}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(request.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
