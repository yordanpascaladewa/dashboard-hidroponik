'use client';

import { FiCheckCircle } from 'react-icons/fi';

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Laporan Analitik</h1>
        <p className="text-sm text-gray-500 mt-1">Evaluasi performa nutrisi tanaman berdasarkan riwayat sensor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Rata-rata pH Air (7 Hari)</p>
          <h2 className="text-4xl font-black text-emerald-600">6.2</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Rata-rata Nutrisi TDS (7 Hari)</p>
          <h2 className="text-4xl font-black text-indigo-600">1140<span className="text-lg text-gray-500 font-semibold ml-1">PPM</span></h2>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-8 flex items-start gap-4">
        <FiCheckCircle className="text-2xl text-emerald-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-emerald-900 text-lg mb-1">Kesimpulan Sistem</h3>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Kondisi tandon air sangat stabil dan ideal. Fluktuasi pH dan TDS berada dalam batas toleransi pertumbuhan. Nutrisi disalurkan dengan presisi yang aman oleh sistem otomatis. Tidak diperlukan intervensi manual saat ini.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 text-lg mb-6">Grafik Tren Historis (Mingguan)</h3>
        <div className="h-72 w-full bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
          <p className="text-sm">Area Grafik Line (pH & TDS) Recharts</p>
        </div>
      </div>
    </div>
  );
}