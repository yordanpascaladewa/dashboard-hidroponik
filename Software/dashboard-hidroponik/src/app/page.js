'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState({ suhu: 0, ph: 0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetTanaman, setTargetTanaman] = useState("SELADA");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
          const formattedChart = result.data.map(item => ({
            waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            Suhu: item.suhu,
            pH: item.ph,
            TDS: item.tds
          })).reverse();
          setChartData(formattedChart);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKirimKomando = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTanaman }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const isRunning = data.status !== 'STANDBY';

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 font-sans text-zinc-800 selection:bg-emerald-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">DFT Telemetry System</h1>
            <p className="text-sm text-zinc-500 mt-1">Sistem Manajemen & Kontrol Aktuator Jarak Jauh</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Status Engine</p>
              <p className="text-sm font-medium text-zinc-600 mt-0.5">
                {data.timestamp ? new Date(data.timestamp).toLocaleTimeString('id-ID') : '--:--:--'}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium tracking-wide
              ${isRunning ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></div>
              {data.status}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MAIN METRICS & CHART */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Suhu Aktual', val: data.suhu, unit: '°C' },
                  { label: 'Tingkat pH', val: data.ph, unit: 'pH' },
                  { label: 'Konsentrasi TDS', val: data.tds, unit: 'PPM' },
                  { label: 'Usia Tanam', val: data.usia, unit: 'Hari' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                    <p className="text-xs font-medium text-zinc-400 mb-2">{item.label}</p>
                    <p className="text-2xl font-semibold tracking-tight text-zinc-800">
                      {item.val}<span className="text-xs font-normal text-zinc-400 ml-1">{item.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-semibold text-zinc-800">Analitik Real-Time</h2>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>pH</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-800"></div>TDS</span>
                  </div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#a1a1aa'}} tickMargin={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#a1a1aa'}} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#a1a1aa'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', color: '#fafafa', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fafafa' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                      <Line yAxisId="right" type="monotone" dataKey="TDS" stroke="#27272a" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* COMMAND CENTER */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] h-full flex flex-col">
                <h2 className="text-sm font-semibold text-zinc-800 mb-1">Command Center</h2>
                <p className="text-xs text-zinc-500 mb-6 border-b border-zinc-100 pb-4">
                  Bypass input lokal dan kirim target dosing otomatis ke mikrokontroler.
                </p>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-2">Pilih Komoditas</label>
                    <div className="relative">
                      <select 
                        value={targetTanaman}
                        onChange={(e) => setTargetTanaman(e.target.value)}
                        className="w-full appearance-none bg-zinc-50 border border-zinc-200 text-sm font-medium text-zinc-800 rounded-lg p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      >
                        <option value="SELADA">Selada (pH 6.0 | TDS 800)</option>
                        <option value="PAKCOY">Pakcoy (pH 6.5 | TDS 1050)</option>
                        <option value="BAYAM">Bayam (pH 6.2 | TDS 1260)</option>
                        <option value="KANGKUNG">Kangkung (pH 6.0 | TDS 1000)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleKirimKomando}
                  disabled={isSyncing}
                  className={`mt-8 w-full text-xs font-semibold py-3 px-4 rounded-lg transition-all
                    ${isSyncing 
                      ? 'bg-zinc-100 text-zinc-400 cursor-wait' 
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]'}`}
                >
                  {isSyncing ? 'MENGIRIM...' : 'KIRIM INSTRUKSI'}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}