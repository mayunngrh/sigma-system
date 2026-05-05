import { FolderIcon, ClockIcon, CheckCircleIcon, FileIcon, DownloadIcon, LightbulbIcon, FileTextIcon } from '../Icons';

export default function StudentDashboard() {
  const documents = [
    {
      id: 1,
      title: 'Surat Keterangan Kuliah',
      description: 'Dokumen untuk membuktikan status mahasiswa aktif',
      fileType: 'PDF',
      fileSize: '245 KB',
      downloadUrl: '#',
    },
    {
      id: 2,
      title: 'Surat Izin Penelitian',
      description: 'Formulir untuk pengajuan izin melakukan penelitian',
      fileType: 'DOCX',
      fileSize: '128 KB',
      downloadUrl: '#',
    },
    {
      id: 3,
      title: 'Surat Dispensasi',
      description: 'Template surat permohonan dispensasi kehadiran',
      fileType: 'PDF',
      fileSize: '185 KB',
      downloadUrl: '#',
    },
    {
      id: 4,
      title: 'Surat Rekomendasi',
      description: 'Formulir untuk meminta surat rekomendasi dari dosen',
      fileType: 'DOCX',
      fileSize: '92 KB',
      downloadUrl: '#',
    },
    {
      id: 5,
      title: 'Form Beasiswa',
      description: 'Formulir lengkap untuk mendaftar program beasiswa',
      fileType: 'PDF',
      fileSize: '356 KB',
      downloadUrl: '#',
    },
    {
      id: 6,
      title: 'Surat Cuti Akademik',
      description: 'Template pengajuan cuti dari program akademik',
      fileType: 'DOCX',
      fileSize: '110 KB',
      downloadUrl: '#',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a2332] mb-2">Selamat datang kembali! 👋</h1>
        <p className="text-gray-600">Download dan isi dokumen yang Anda butuhkan, kemudian ajukan melalui sistem</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Dokumen</p>
              <p className="text-3xl font-bold text-[#0d8b8b] mt-2">{documents.length}</p>
            </div>
            <div className="text-[#0d8b8b]">
              <FolderIcon />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Permintaan Aktif</p>
              <p className="text-3xl font-bold text-[#b8d400] mt-2">2</p>
            </div>
            <div className="text-[#b8d400]">
              <ClockIcon />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Selesai Diproses</p>
              <p className="text-3xl font-bold text-green-600 mt-2">3</p>
            </div>
            <div className="text-green-600">
              <CheckCircleIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#0d8b8b]/5 to-[#b8d400]/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-[#0d8b8b]">
              <FileIcon />
            </div>
            <h2 className="text-lg font-bold text-[#1a2332]">Dokumen Yang Tersedia</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Download template dokumen, isi sesuai data Anda, lalu ajukan melalui sistem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-5 hover:border-[#0d8b8b] hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-[#0d8b8b] mt-1">
                    <FileTextIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a2332] group-hover:text-[#0d8b8b] transition">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded font-medium">
                    {doc.fileType}
                  </span>
                  <span>{doc.fileSize}</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0d8b8b] hover:bg-[#066b6b] text-white rounded-lg font-medium text-sm transition shadow-sm hover:shadow-md">
                  <DownloadIcon />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex gap-4">
        <div className="text-blue-600 shrink-0">
          <LightbulbIcon />
        </div>
        <div>
          <p className="font-semibold text-blue-900 mb-2">Cara Menggunakan Dokumen</p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Download dokumen template yang Anda butuhkan</li>
            <li>Buka file dan isi dengan data lengkap Anda</li>
            <li>Simpan dokumen yang sudah terisi</li>
            <li>Kembali ke halaman "Buat Permintaan Baru" dan upload dokumen</li>
            <li>Ajukan permintaan melalui sistem</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
