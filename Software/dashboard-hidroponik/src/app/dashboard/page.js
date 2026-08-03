'use client';

import { useState, useEffect } from 'react';
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
  // Simulasi status koneksi alat (Online/Offline)
  const [isOnline, setIsOnline] = useState(true);
  
  // State penampung data sensor & power center
  // Nanti nilai-nilai ini bisa lu sambungin ke API MongoDB lu
  const [sensorData, setSensorData] = useState({
    suhu_air: 28.4,
    ph_air: 5.6,
    tds_ppm: 1152,
    komoditas_aktif: 'Kangkung',
    umur_bibit: 'Hari ke-15',
    fase_tumbuh: 'Vegetatif',
    voltase_baterai: 12.6,
    energi_solar: 340
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* --- 1. HEADER & STATUS BAR --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              AeroGrow Pro - Telemetri
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sistem Fertigasi Hidroponik DFT Otomatis Berbasis IoT & Tenaga Surya
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Info Profil Tanaman */}
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FiCheckCircle className="text-sm" /> 
              PROFIL: {sensorData.komoditas_aktif.toUpperCase()}
            </span>
            {/* Status Koneksi */}
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${isOnline ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isOnline ? 'Sistem Online' : 'Sistem Offline (NVS)'}
            </span>
          </div>
        </header>

        {/* --- 2. NOTIFIKASI FAULT TOLERANCE (MUNCUL KALAU OFFLINE) --- */}
        {!isOnline && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start md:items-center gap-3 text-red-800 shadow-sm">
            <FiAlertTriangle className="text-xl flex-shrink-0 mt-0.5 md:mt-0" />
            <p className="text-sm font-medium">
              <strong>Peringatan:</strong> Koneksi ke peladen terputus. Sistem tetap berjalan otomatis menggunakan rekaman data terakhir di memori NVS lokal (*Fault Tolerance* aktif).
            </p>
          </div>
        )}

        {/* --- 3. GRID KARTU PARAMETER (6 KOTAK) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Suhu Air */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Suhu Air</span>
              <div className="p-2 bg-blue-50 rounded-lg"><FiThermometer className="text-xl text-blue-500" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-800">{sensorData.suhu_air}</h2>
              <span className="text-gray-500 font-semibold">°C</span>
            </div>
            <p className="text-xs text-blue-600 mt-3 font-semibold bg-blue-50 inline-block px-2 py-1 rounded-md">Optimal</p>
          </div>

          {/* Tingkat pH */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tingkat pH</span>
              <div className="p-2 bg-emerald-50 rounded-lg"><FiDroplet className="text-xl text-emerald-500" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-800">{sensorData.ph_air}</h2>
              <span className="text-gray-500 font-semibold">pH</span>
            </div>
            <p className="text-xs text-emerald-600 mt-3 font-semibold bg-emerald-50 inline-block px-2 py-1 rounded-md">Target: 6.0 - 6.5</p>
          </div>

          {/* Nutrisi (TDS) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Nutrisi (TDS)</span>
              <div className="p-2 bg-indigo-50 rounded-lg"><FiActivity className="text-xl text-indigo-500" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-800">{sensorData.tds_ppm}</h2>
              <span className="text-gray-500 font-semibold">PPM</span>
            </div>
            <p className="text-xs text-indigo-600 mt-3 font-semibold bg-indigo-50 inline-block px-2 py-1 rounded-md">Fuzzy Logic Aktif</p>
          </div>

          {/* Umur Bibit */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Umur Tanaman</span>
              <div className="p-2 bg-amber-50 rounded-lg"><FiCalendar className="text-xl text-amber-500" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-gray-800">{sensorData.umur_bibit}</h2>
            </div>
            <p className="text-xs text-amber-600 mt-3 font-semibold bg-amber-50 inline-block px-2 py-1 rounded-md">Fase: {sensorData.fase_tumbuh}</p>
          </div>

          {/* Voltase Baterai */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow border-l-4 border-l-teal-400">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Voltase Baterai</span>
              <div className="p-2 bg-teal-50 rounded-lg"><FiBatteryCharging className="text-xl text-teal-500" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-800">{sensorData.voltase_baterai}</h2>
              <span className="text-gray-500 font-semibold">V</span>
            </div>
            <p className="text-xs text-teal-600 mt-3 font-semibold bg-teal-50 inline-block px-2 py-1 rounded-md">Status: Discharging</p>
          </div>

          {/* Energi Solar Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow border-l-4 border-l-yellow-400">
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Energi Disimpan</span>
              <div className="p-2 bg-yellow-50 rounded-lg"><FiSun className="text-xl text-yellow-500" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-gray-800">{sensorData.energi_solar}</h2>
              <span className="text-gray-500 font-semibold">Wh</span>
            </div>
            <p className="text-xs text-yellow-600 mt-3 font-semibold bg-yellow-50 inline-block px-2 py-1 rounded-md">Akumulasi Harian</p>
          </div>

        </div>

        {/* --- 4. GRAFIK KUALITAS AIR (FULL WIDTH) --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Grafik Kualitas Air (24 Jam)</h3>
              <p className="text-xs text-gray-500 mt-1">Korelasi tingkat keasaman (pH) dan nutrisi (TDS)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold tracking-wide">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm"></span> pH Air
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 bg-indigo-400 rounded-full shadow-sm"></span> TDS (PPM)
              </span>
            </div>
          </div>

          {/* Area Placeholder Grafik - Nanti lu bisa ganti pakai Recharts / Chart.js */}
          <div className="h-80 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
            <FiActivity className="text-4xl mb-2 opacity-50" />
            <p className="text-sm font-medium">Area Komponen Grafik Riwayat Sensor</p>
            <p className="text-xs mt-1">(Integrasikan Recharts / Chart.js di sini)</p>
          </div>
        </div>

      </div>
    </div>
  );
}