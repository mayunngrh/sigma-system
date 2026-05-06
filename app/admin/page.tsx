'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';

interface Request {
  id: string;
  user_id: string;
  user_type: string;
  request_type: string;
  purpose: string;
  urgency: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
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

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const res = await fetch('/api/admin/requests');
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      return data.requests || [];
    },
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r: Request) => r.status === 'pending').length,
    inProgress: requests.filter((r: Request) => r.status === 'in_progress').length,
    completed: requests.filter((r: Request) => r.status === 'completed').length,
    rejected: requests.filter((r: Request) => r.status === 'rejected').length,
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2332]">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Kelola semua permintaan akademik</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-[#0d8b8b]' },
            { label: 'Menunggu', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Diproses', value: stats.inProgress, color: 'text-blue-600' },
            { label: 'Selesai', value: stats.completed, color: 'text-green-600' },
            { label: 'Ditolak', value: stats.rejected, color: 'text-red-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#1a2332]">Semua Permintaan</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-400">Memuat data...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg">Belum ada permintaan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Jenis Permintaan</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tujuan</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Urgensi</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((request: Request) => {
                    const status = statusConfig[request.status] || { label: request.status, color: 'bg-gray-100 text-gray-800' };
                    const urgency = urgencyConfig[request.urgency] || urgencyConfig.normal;
                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-[#1a2332]">
                          {formatRequestType(request.request_type)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {request.purpose}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${urgency.color}`}>
                            {urgency.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(request.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/admin/requests/${request.id}`)}
                            className="px-4 py-2 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-medium text-sm transition"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
