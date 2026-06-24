'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState({ suhu: 0, ph: 0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil data telemetri:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // PERBAIKAN: Menarik data baru dari database setiap 2 detik (2000ms)
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const lastUpdate = data.timestamp 
    ? new Date(data.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second:'2-digit' }) 
    : '--:--:--';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-2">
              Dashboard Fertigasi Hidroponik
            </h1>
            <p className="text-slate-500 font-medium">Sistem Telemetri Adaptif Multi-Komoditas</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Status Sistem</p>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide shadow-sm flex items-center gap-2
              ${data.status === 'STANDBY' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                data.status === 'RUNNING_NORMAL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                'bg-blue-100 text-blue-800 border border-blue-200'}`}>
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                  ${data.status === 'STANDBY' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 
                  ${data.status === 'STANDBY' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              {data.status.replace(/_/g, ' ')}
            </div>
            <p className="text-xs text-slate-400 mt-2">Update: {lastUpdate}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <div className="text-slate-500 font-medium animate-pulse">Menghubungkan ke mikrokontroler...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Suhu Air</h3>
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-extrabold text-slate-800">{data.suhu}<span className="text-2xl text-blue-500 font-bold ml-1">°C</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tingkat pH</h3>
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-extrabold text-slate-800">{data.ph}<span className="text-lg text-emerald-500 font-medium ml-2">pH</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nutrisi (TDS)</h3>
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-extrabold text-slate-800">{data.tds}<span className="text-xl text-purple-500 font-bold ml-1">PPM</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Usia Tanaman</h3>
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-extrabold text-slate-800">{data.usia}<span className="text-xl text-orange-500 font-bold ml-1">Hari</span></p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}