'use client';

import { useState } from 'react';
import { 
  FiActivity, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiDroplet, 
  FiThermometer, 
  FiCalendar, 
  FiBatteryCharging, 
  FiSun 
} from 'react-icons/fi';

export default function DashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
  
  // State data gabungan telemetri & power center solar panel
  const [sensorData] = useState({
    tds_ppm: 1152,
    ph_air: 5.6,
    suhu_air: 28.4,
    umur_bibit: 'Hari ke-15',
    fase_tumbuh: 'Vegetatif',
    komoditas_aktif: 'Kangkung',
    voltase_baterai: '12.6',
    energi_solar: '340'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard & Status Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AeroGrow Pro - Full Dashboard Telemetri</h1>
            <p className="text-sm text-gray-500">Sistem Fertigasi Hidroponik DFT Otomatis Berbasis IoT & Solar Panel.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FiCheckCircle /> PROFIL: {sensorData.komoditas_aktif.toUpperCase()} ({sensorData.fase_tumbuh})
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isOnline ? 'SISTEM ONLINE' : 'SISTEM OFFLINE (NVS Active)'}
            </span>
          </div>
        </header>

        {/* Notifikasi Fault Tolerance jika Terputus */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800">
            <FiAlertTriangle className="text-xl flex-shrink-0" />
            <p className="text-sm">
              <strong>Peringatan:</strong> Koneksi ke peladen terputus. Data ditampilkan dari rekaman mandiri memori NVS lokal (*Fault Tolerance*).
            </p>
          </div>
        )}

        {/* Grid Kartu Parameter (Sensor Air, Tanaman, & Power Center) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          
          {/* 1. Suhu Air */}
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

          {/* 2. Tingkat pH */}
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

          {/* 3. Nutrisi (TDS) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Nutrisi (TDS)</span>
              <FiActivity className="text-lg text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">{sensorData.tds_ppm}</h2>
              <span className="text-gray-500 font-medium">PPM</span>
            </div>
            <p className="text-xs text-indigo-600 mt-2 font-medium">Kendali Logika Fuzzy Aktif</p>
          </div>

          {/* 4. Umur Bibit */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Umur Bibit / Tanaman</span>
              <FiCalendar className="text-lg text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{sensorData.umur_bibit}</h2>
            </div>
            <p className="text-xs text-gray-400 mt-2">Fase: {sensorData.fase_tumbuh}</p>
          </div>

          {/* 5. Power Center: Voltase Baterai */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Voltase Baterai</span>
              <FiBatteryCharging className="text-lg text-teal-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">{sensorData.voltase_baterai}</h2>
              <span className="text-gray-500 font-medium">V</span>
            </div>
            <p className="text-xs text-teal-600 mt-2 font-medium">Status: Normal / Mengisi</p>
          </div>

          {/* 6. Power Center: Energi Disimpan Solar Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Energi Solar Panel</span>
              <FiSun className="text-lg text-yellow-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900">{sensorData.energi_solar}</h2>
              <span className="text-gray-500 font-medium">Wh</span>
            </div>
            <p className="text-xs text-yellow-600 mt-2 font-medium">Akumulasi Harian</p>
          </div>

        </div>

        {/* Grafik Kualitas Air (Lebar Penuh) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Grafik Tren Kualitas Air (24 Jam)</h3>
              <p className="text-xs text-gray-400">Pemantauan korelasi linier parameter keasaman (pH) dan konsentrasi nutrisi (TDS)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> pH Air</span>
              <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span> TDS (PPM)</span>
            </div>
          </div>

          {/* Area Grafik */}
          <div className="h-72 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
            [ Area Grafik Recharts / Chart.js Tren Sensor Real-Time ]
          </div>
        </div>

      </div>
    </div>
  );
}