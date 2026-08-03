'use client';
import { FiBatteryCharging, FiSun, FiActivity } from 'react-icons/fi';

export default function SystemHealthPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Health & Power</h1>
        <p className="text-sm text-gray-500 mt-1">Pemantauan catu daya cadangan dan kesehatan aktuator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-teal-400">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Kapasitas Voltase Aki</span>
            <div className="p-2 bg-teal-50 rounded-lg"><FiBatteryCharging className="text-xl text-teal-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-gray-800">12.6</h2>
            <span className="text-gray-500 font-semibold text-xl">V</span>
          </div>
          <p className="text-sm font-medium text-teal-600 mt-4">Status: Optimal (Siap mem-*backup* PLN)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Daya Disimpan Solar Panel</span>
            <div className="p-2 bg-yellow-50 rounded-lg"><FiSun className="text-xl text-yellow-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-gray-800">340</h2>
            <span className="text-gray-500 font-semibold text-xl">Wh</span>
          </div>
          <p className="text-sm font-medium text-yellow-600 mt-4">Pengisian daya dari panel surya berjalan normal.</p>
        </div>
      </div>
    </div>
  );
}