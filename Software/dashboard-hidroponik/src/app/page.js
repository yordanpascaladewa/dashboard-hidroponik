'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState({ suhu: 0, ph: 0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Control Panel (Pengganti Rotary Encoder)
  const [targetTanaman, setTargetTanaman] = useState("SELADA");
  const [isSyncing, setIsSyncing] = useState(false);

  // Tarik data telemetri untuk indikator dan grafik
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data[0]); // Data terbaru untuk Card
          
          // Format data untuk grafik (dibalik urutannya biar yang paling kanan itu yang terbaru)
          const formattedChart = result.data.map(item => ({
            waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            Suhu: item.suhu,
            pH: item.ph,
            TDS: item.tds
          })).reverse();
          
          setChartData(formattedChart);
        }
      } catch (error) {
        console.error("Gagal mengambil data telemetri:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Update setiap 2 detik
    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk mengirim komando target tanaman ke MongoDB
  const handleKirimKomando = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetTanaman }),
      });
      
      if (response.ok) {
        alert(`Komando target ${targetTanaman} berhasil dikirim ke server! ESP32 akan segera menyesuaikan.`);
      } else {
        alert("Gagal mengirim komando ke server.");
      }
    } catch (error) {
      console.error("Error setting komando:", error);
      alert("Terjadi kesalahan jaringan saat mengirim komando.");
    } finally {
      setIsSyncing(false);
    }
  };

  const lastUpdate = data.timestamp 
    ? new Date(data.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second:'2-digit' }) 
    : '--:--:--';

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-1">
              Dashboard Fertigasi Hidroponik
            </h1>
            <p className="text-slate-500 font-medium">Sistem Telemetri Adaptif Multi-Komoditas</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Status Sistem</p>
            <div className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide flex items-center gap-2
              ${data.status === 'STANDBY' ? 'bg-amber-100 text-amber-800' : 
                data.status === 'RUNNING_NORMAL' ? 'bg-emerald-100 text-emerald-800' : 
                'bg-blue-100 text-blue-800'}`}>
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                  ${data.status === 'STANDBY' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 
                  ${data.status === 'STANDBY' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              {data.status.replace(/_/g, ' ')}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Update: {lastUpdate}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* KARTU PARAMETER */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Suhu Air', value: data.suhu, unit: '°C', color: 'blue' },
                { label: 'Tingkat pH', value: data.ph, unit: 'pH', color: 'emerald' },
                { label: 'Nutrisi (TDS)', value: data.tds, unit: 'PPM', color: 'purple' },
                { label: 'Usia Tanaman', value: data.usia, unit: 'Hari', color: 'orange' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${item.color}-50 rounded-full group-hover:scale-110 transition-transform`}></div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider relative z-10">{item.label}</h3>
                  <p className="text-4xl font-extrabold text-slate-800 mt-4 relative z-10">
                    {item.value}<span className={`text-lg text-${item.color}-500 font-bold ml-1`}>{item.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GRAFIK LIVE DATA */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span> Tren Parameter Real-Time
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="waktu" tick={{fontSize: 12, fill: '#64748b'}} tickMargin={10} />
                      <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                      <Line yAxisId="left" type="monotone" dataKey="Suhu" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      <Line yAxisId="left" type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={3} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="TDS" stroke="#a855f7" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PANEL KONTROL (PENGGANTI ROTARY ENCODER) */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-500 rounded-full"></span> Control Panel
                </h3>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Target Komoditas
                    </label>
                    <select 
                      value={targetTanaman}
                      onChange={(e) => setTargetTanaman(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg font-bold rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-4 outline-none transition-all"
                    >
                      <option value="SELADA">Selada (pH 6.0 | TDS 800)</option>
                      <option value="PAKCOY">Pakcoy (pH 6.5 | TDS 1050)</option>
                      <option value="BAYAM">Bayam (pH 6.2 | TDS 1260)</option>
                      <option value="KANGKUNG">Kangkung (pH 6.0 | TDS 1000)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Komando yang dikirim akan mengesampingkan input Rotary Encoder fisik di lapangan. Sistem ESP32 akan melakukan dosing otomatis menyesuaikan komoditas yang dipilih.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleKirimKomando}
                  disabled={isSyncing}
                  className={`mt-6 w-full text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md
                    ${isSyncing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:-translate-y-1'}`}
                >
                  {isSyncing ? 'Menyinkronkan...' : 'Kirim Komando ke Hardware'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}