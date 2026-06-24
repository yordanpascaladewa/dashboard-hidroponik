"use client"; // Wajib pakai ini biar bisa jalanin auto-refresh di browser

import { useState, useEffect } from "react";

export default function Dashboard() {
  // 1. State untuk nyimpen data dari database
  const [telemetry, setTelemetry] = useState({
    suhu: 0,
    ph: 0,
    tds: 0,
    usia: 0,
    status: "STANDBY",
  });
  const [lastUpdate, setLastUpdate] = useState("--:--:--");

  // 2. Fungsi untuk narik data dari API lu
  const fetchTelemetry = async () => {
    try {
      // Tambahin cache: 'no-store' biar browser nggak nyimpen cache API
      const response = await fetch("/api/telemetry", {
        cache: "no-store", 
      });
      const result = await response.json();

      // Asumsi API lu ngembaliin data di dalam object (sesuaikan kalau API lu ngirim array)
      // Misal API kirim: { suhu: 27.5, ph: 14, tds: 0, usia: 11, status: "TDS_INJECT_A" }
      if (result) {
        // Kalau data dari API berbentuk array (ngambil banyak data), ambil index [0]
        const latestData = Array.isArray(result) ? result[0] : result;
        
        setTelemetry({
          suhu: latestData.suhu || 0,
          ph: latestData.ph || 0,
          tds: latestData.tds || 0,
          usia: latestData.usia || 0,
          status: latestData.status || "STANDBY",
        });

        // Update jam terakhir ditarik
        const now = new Date();
        setLastUpdate(now.toLocaleTimeString("id-ID"));
      }
    } catch (error) {
      console.error("Gagal fetch data:", error);
    }
  };

  // 3. Sistem Auto-Refresh (Jalan setiap 2 detik)
  useEffect(() => {
    fetchTelemetry(); // Tarik data pas web pertama kali dibuka

    const interval = setInterval(() => {
      fetchTelemetry();
    }, 2000); // 2000 ms = 2 detik

    // Bersihin interval kalau pindah halaman biar nggak bocor memori
    return () => clearInterval(interval);
  }, []);

  // Format Status Teks biar rapi
  const formatStatus = (status) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-teal-600">
              Dashboard Fertigasi Hidroponik
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sistem Telemetri Adaptif Multi-Komoditas
            </p>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] font-semibold text-slate-400 mb-1 tracking-wider">STATUS SISTEM</p>
            <div className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-full flex items-center gap-2 text-sm">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${telemetry.status === 'STANDBY' ? 'bg-orange-400' : 'bg-green-500'}`}></span>
              {formatStatus(telemetry.status)}
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Update: {lastUpdate}
            </p>
          </div>
        </div>

        {/* KARTU SENSOR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Kartu Suhu */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 tracking-wider">SUHU AIR</p>
              <div className="p-2 bg-blue-50 text-blue-500 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h2 className="text-4xl font-extrabold text-slate-800">{telemetry.suhu}</h2>
              <span className="text-lg font-bold text-blue-500">°C</span>
            </div>
          </div>

          {/* Kartu pH */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 tracking-wider">TINGKAT PH</p>
              <div className="p-2 bg-green-50 text-green-500 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h2 className="text-4xl font-extrabold text-slate-800">{telemetry.ph}</h2>
              <span className="text-lg font-bold text-green-500">pH</span>
            </div>
          </div>

          {/* Kartu TDS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 tracking-wider">NUTRISI (TDS)</p>
              <div className="p-2 bg-purple-50 text-purple-500 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h2 className="text-4xl font-extrabold text-slate-800">{telemetry.tds}</h2>
              <span className="text-lg font-bold text-purple-500">PPM</span>
            </div>
          </div>

          {/* Kartu Usia */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 tracking-wider">USIA TANAMAN</p>
              <div className="p-2 bg-orange-50 text-orange-500 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h2 className="text-4xl font-extrabold text-slate-800">{telemetry.usia}</h2>
              <span className="text-lg font-bold text-orange-500">Hari</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}