'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [tanaman, setTanaman] = useState('Selada');

  // Contoh data statis (Nantinya ini akan ditarik dari MongoDB/API Vercel kamu)
  const sensorData = {
    suhu: 24.5,
    ph: 6.2,
    tds: 1050,
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Telemetry Dashboard</h1>
          <button className="px-4 py-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
            Logout
          </button>
        </div>

        {/* Control Panel */}
        <div className="p-6 mb-8 bg-white rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Pengaturan Sistem</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Pilih Target Tanaman:</label>
            <select 
              value={tanaman}
              onChange={(e) => setTanaman(e.target.value)}
              className="w-64 px-4 py-2 border rounded-lg focus:ring-green-500 text-black"
            >
              <option value="Selada">Selada</option>
              <option value="Pakcoy">Pakcoy</option>
              <option value="Bayam">Bayam</option>
              <option value="Kangkung">Kangkung</option>
            </select>
          </div>
        </div>

        {/* Live Data Cards */}
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Live Sensor Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Suhu */}
          <div className="p-6 bg-white border-l-4 border-blue-500 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Suhu Air</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{sensorData.suhu}°C</h3>
          </div>
          
          {/* Card pH */}
          <div className="p-6 bg-white border-l-4 border-green-500 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Kadar pH</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{sensorData.ph}</h3>
          </div>

          {/* Card Nutrisi */}
          <div className="p-6 bg-white border-l-4 border-yellow-500 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Nutrisi (TDS)</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{sensorData.tds} PPM</h3>
          </div>
        </div>
      </div>
    </div>
  );
}