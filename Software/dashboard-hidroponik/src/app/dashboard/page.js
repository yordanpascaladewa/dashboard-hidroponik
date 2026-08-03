'use client';

import { useState, useEffect } from 'react';
import { 
  FiActivity, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiCpu, 
  FiRefreshCw, 
  FiDroplet, 
  FiThermometer, 
  FiCalendar 
} from 'react-icons/fi';

export default function DashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [sensorData, setSensorData] = useState({
    tds_ppm: 1152,
    ph_air: 5.6,
    suhu_air: 28.4,
    fase_tumbuh: 'Hari 15 (Vegetatif)',
    komoditas_aktif: 'Kangkung'
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigasi Samping */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div>
              <h1 className="font-bold text-gray-800">System Alpha</h1>
              <p className="text-xs text-emerald-600 font-medium">OTOMATIS - FUZZY LOGIC</p>
            </div>
          </div>

          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-medium">
              <FiActivity /> Dashboard
            </a>
            <a href="/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <FiCpu /> Power Analytics
            </a>
            <a href="/command-center" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <FiRefreshCw /> System Status
            </a>
          </nav>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">Universitas Diponegoro</p>
          <p className="text-xs font-semibold text-gray-600">Skripsi Yordan Pascaladewa</p>
        </div>
      </aside>

      {/* Konten Utama Dasbor */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AeroGrow Pro - Telemetri Otomatis</h1>
            <p className="text-sm text-gray-500">Pemantauan parameter tandon DFT secara *real-time* berbasis IoT.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FiCheckCircle /> PROFIL AKTIF: {sensorData.komoditas_aktif.toUpperCase()}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isOnline ? 'SISTEM ONLINE' : 'SISTEM OFFLINE (NVS Active)'}
            </span>
          </div>
        </header>

        {/* Notifikasi Status Koneksi jika Terputus */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800">
            <FiAlertTriangle className="text-xl flex-shrink-0" />
            <p className="text-sm">
              <strong>Peringatan:</strong> Alat hidroponik terputus dari server. Data di bawah ini direkam secara mandiri menggunakan memori lokal NVS (*Fault Tolerance* aktif).
            </p>
          </div>
        )}

        {/* Grid Kartu Sensor (Full Lebar 4 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Suhu Air */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Suhu Air</span>
              <FiThermometer className="text-lg text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">{sensorData.suhu_air}</h2>
              <span className="text-gray-500 font-medium">°C</span>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">Kondisi Optimal</p>
          </div>

          {/* Tingkat pH */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Tingkat pH Air</span>
              <FiDroplet className="text-lg text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">{sensorData.ph_air}</h2>
              <span className="text-gray-500 font-medium">pH</span>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">Target Acuan: 6.0 - 6.5</p>
          </div>

          {/* Nutrisi TDS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Nutrisi (TDS)</span>
              <FiActivity className="text-lg text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">{sensorData.tds_ppm}</h2>
              <span className="text-gray-500 font-medium">PPM</span>
            </div>
            <p className="text-xs text-indigo-600 mt-2 font-medium">Kendali Fuzzy Aktif</p>
          </div>

          {/* Fase Tumbuh */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Fase & Umur Tanaman</span>
              <FiCalendar className="text-lg text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-gray-900 mt-1">{sensorData.fase_tumbuh}</h2>
            </div>
            <p className="text-xs text-gray-400 mt-2">Sinkronisasi LUT Otomatis</p>
          </div>
        </div>

        {/* Bagian Grafik Tren Kualitas Air (Lebar Penuh) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Tren Kualitas Air (24 Jam Terakhir)</h3>
              <p className="text-xs text-gray-400">Grafik korelasi otomatis antara tingkat keasaman (pH) dan konsentrasi (TDS)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> pH Air</span>
              <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span> TDS (PPM)</span>
            </div>
          </div>

          {/* Area Simulasi Grafik */}
          <div className="h-72 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
            [ Area Komponen Grafik Recharts / Chart.js Tren Sensor Real-Time ]
          </div>
        </div>
      </main>
    </div>
  );
}