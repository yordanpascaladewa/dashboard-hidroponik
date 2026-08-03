'use client';

import { useState } from 'react';
import { 
  FiThermometer, FiDroplet, FiActivity, FiCalendar, 
  FiBell, FiSettings, FiUser, FiAlertCircle 
} from 'react-icons/fi';

export default function DashboardPage() {
  const [isOnline] = useState(false); // Simulasi koneksi alat (terputus)
  const [isPlantingActive, setIsPlantingActive] = useState(false);
  const [komoditas, setKomoditas] = useState('Kangkung');
  const [umurPanen, setUmurPanen] = useState(25);

  const handleStart = (e) => {
    e.preventDefault();
    setIsPlantingActive(true);
    // Trigger MQTT/API ke ESP32 untuk memulai siklus otomatis di sini
  };

  const handleStop = () => {
    setIsPlantingActive(false);
    // Trigger MQTT/API ke ESP32 untuk menghentikan siklus
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-8 font-sans text-gray-800">
      
      {/* Header Bar Area */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">AeroGrow Pro - Telemetri</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor dan kontrol nutrisi otomatis real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            🌱 Profil Aktif: {komoditas}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-[11px] font-bold tracking-wide bg-red-50 text-red-600 border border-red-200 uppercase gap-1.5">
            <FiAlertCircle className="text-sm" /> Sistem Offline
          </span>
          <div className="flex gap-2 ml-2">
            <button className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"><FiBell /></button>
            <button className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"><FiSettings /></button>
            <button className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"><FiUser /></button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* LEFT COLUMN: Telemetry & Charts */}
        <div className="flex-1 space-y-6">
          
          {/* Offline Alert Banner */}
          {!isOnline && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm shadow-sm">
              <FiAlertCircle className="text-lg flex-shrink-0" />
              <p><strong className="font-semibold">Peringatan:</strong> Alat hidroponik terputus dari server. Data di bawah ini adalah rekaman terakhir sebelum koneksi terputus.</p>
            </div>
          )}

          {/* 4 Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Suhu Air */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Suhu Air</span>
                <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400"><FiThermometer /></div>
              </div>
              <h2 className="text-[32px] font-black text-gray-800 leading-none">28.4<span className="text-sm text-gray-500 font-semibold ml-1">°C</span></h2>
            </div>

            {/* Tingkat pH */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tingkat pH</span>
                <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400"><FiDroplet /></div>
              </div>
              <h2 className="text-[32px] font-black text-gray-800 leading-none">5.6</h2>
            </div>

            {/* Nutrisi TDS */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Nutrisi (TDS)</span>
                <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400"><FiActivity /></div>
              </div>
              <h2 className="text-[32px] font-black text-gray-800 leading-none">1152<span className="text-sm text-gray-500 font-semibold ml-1">PPM</span></h2>
            </div>

            {/* Fase Tumbuh */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Fase Tumbuh</span>
                <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400"><FiCalendar /></div>
              </div>
              <h2 className="text-2xl font-black text-gray-800 leading-none mt-2">Hari 15</h2>
            </div>
          </div>

          {/* Large Chart Area */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-[17px] font-bold text-gray-900">Tren Kualitas Air (24 Jam)</h3>
                <p className="text-[13px] text-gray-500 mt-1">Korelasi pH dan konsentrasi TDS</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold tracking-wide">
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 bg-[#00c48c] rounded-full"></span> PH</span>
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span> TDS</span>
              </div>
            </div>
            
            {/* Area Visualisasi Grafik Line */}
            <div className="h-[340px] w-full border-b border-l border-gray-100 relative">
               <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm font-medium">
                  [ Integrasi Recharts / Chart.js Line Chart ]
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pusat Kendali (Setup & Monitoring Mode) */}
        <div className="w-full xl:w-[400px]">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full min-h-[500px]">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-8">
              <FiSettings className="text-gray-400" /> Pusat Kendali
            </h3>

            {/* Form Setup - Hanya bisa diedit jika sistem belum mulai menanam */}
            <form className="flex-1 space-y-6" onSubmit={handleStart}>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Komoditas</label>
                <select 
                  value={komoditas}
                  onChange={(e) => setKomoditas(e.target.value)}
                  disabled={isPlantingActive} // Nonaktifkan jika sudah masuk mode monitoring
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700 font-medium disabled:opacity-60 appearance-none"
                >
                  <option value="Kangkung">Kangkung</option>
                  <option value="Pakcoy">Pakcoy</option>
                  <option value="Selada">Selada</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Target Usia Panen (Maks 40)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={umurPanen}
                    onChange={(e) => setUmurPanen(e.target.value)}
                    disabled={isPlantingActive}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700 font-medium disabled:opacity-60"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">HARI</span>
                </div>
              </div>

              <div className="bg-[#f8f9fc] p-5 rounded-xl border border-gray-100 mt-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Parameter Ideal</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><FiDroplet className="text-gray-400"/> Target pH</span>
                    <span className="text-sm font-bold text-[#00c48c]">6.0 - 6.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><FiActivity className="text-gray-400"/> Target TDS</span>
                    <span className="text-sm font-bold text-[#00c48c]">1000 - 1200 PPM</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Tombol Eksekusi Dinamis (Poin 3) */}
            <div className="mt-8">
              {!isOnline ? (
                <button disabled className="w-full py-4 bg-[#8fa0b3] text-white font-bold rounded-xl flex justify-center items-center gap-2 opacity-90 cursor-not-allowed">
                  <FiAlertCircle /> Koneksi Terputus
                </button>
              ) : !isPlantingActive ? (
                <button onClick={handleStart} className="w-full py-4 bg-[#00c48c] hover:bg-emerald-500 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-colors">
                  Mulai Pertumbuhan Otomatis
                </button>
              ) : (
                <button onClick={handleStop} className="w-full py-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold rounded-xl flex justify-center items-center transition-colors">
                  Selesaikan Pertumbuhan
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}