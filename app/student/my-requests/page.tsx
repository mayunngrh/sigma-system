export default function MyRequests() {
  const requests = [
    {
      id: 'REQ-2024-0892',
      title: 'Surat Keterangan Kuliah',
      description: 'Request untuk surat keterangan status mahasiswa aktif',
      submittedDate: '2024-10-24',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 'REQ-2024-0891',
      title: 'Surat Izin Penelitian',
      description: 'Request untuk penelitian skripsi di lapangan',
      submittedDate: '2024-10-19',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'REQ-2024-0890',
      title: 'Surat Dispensasi',
      description: 'Request untuk dispensasi kehadiran kuliah',
      submittedDate: '2024-10-15',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800',
    },
    {
      id: 'REQ-2024-0889',
      title: 'Surat Keterangan Kuliah',
      description: 'Request untuk surat keterangan semester 5',
      submittedDate: '2024-10-10',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a2332] mb-2">Permintaan Saya</h1>
        <p className="text-gray-600">Kelola dan pantau semua permintaan surat akademik Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-[#0d8b8b] mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Menunggu</p>
          <p className="text-2xl font-bold text-[#b8d400] mt-1">
            {requests.filter(r => r.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Selesai</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {requests.filter(r => r.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Ditolak</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {requests.filter(r => r.status === 'Rejected').length}
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1a2332]">Daftar Permintaan</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-6 hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-2xl">📄</div>
                    <div>
                      <h3 className="font-semibold text-[#1a2332] text-lg group-hover:text-[#0d8b8b] transition">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>ID: {request.id}</span>
                    <span>•</span>
                    <span>Diajukan: {new Date(request.submittedDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold ${request.statusColor}`}>
                    {request.status === 'In Progress'
                      ? '⏳ Menunggu'
                      : request.status === 'Completed'
                        ? '✅ Selesai'
                        : '❌ Ditolak'}
                  </span>
                  <button className="text-sm font-medium text-[#0d8b8b] hover:text-[#066b6b] transition">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
