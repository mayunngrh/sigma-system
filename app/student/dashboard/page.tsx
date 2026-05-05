export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a2332] mb-2">Selamat datang kembali! 👋</h1>
        <p className="text-gray-600">Kelola permintaan surat akademik Anda dengan mudah</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Permintaan</p>
              <p className="text-3xl font-bold text-[#0d8b8b] mt-2">5</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Dalam Proses</p>
              <p className="text-3xl font-bold text-[#b8d400] mt-2">2</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Selesai</p>
              <p className="text-3xl font-bold text-green-600 mt-2">3</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-[#1a2332] mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div className="text-2xl">📄</div>
            <div className="flex-1">
              <p className="font-medium text-[#1a2332]">Surat Keterangan Kuliah</p>
              <p className="text-sm text-gray-600">Diajukan 2 hari yang lalu</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>
          </div>
          <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div className="text-2xl">📄</div>
            <div className="flex-1">
              <p className="font-medium text-[#1a2332]">Surat Izin Penelitian</p>
              <p className="text-sm text-gray-600">Diajukan 5 hari yang lalu</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Selesai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
