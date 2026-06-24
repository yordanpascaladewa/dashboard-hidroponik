'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  // State untuk menyimpan data sensor dari database
  const [data, setData] = useState({ suhu: 0, ph: 0, tds: 0, usia: 0, status: "STANDBY" });
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menarik data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        
        // PERBAIKAN: Ambil data array index ke-0 (data paling baru masuk)
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

    // Refresh data otomatis setiap 5 detik agar sinkron dengan ESP32
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Hidroponik</h1>
          <p className="text-gray-500">Sistem Telemetri & Embedded Data Management</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-500 mb-1">Status Sistem</p>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold tracking-wide">
            {data.status}
          </span>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-600 font-medium animate-pulse">Memuat data sensor secara real-time...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Suhu Air</h3>
            <p className="text-3xl font-bold text-blue-600">{data.suhu}°C</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">pH Air</h3>
            <p className="text-3xl font-bold text-green-600">{data.ph}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Nutrisi (TDS)</h3>
            <p className="text-3xl font-bold text-purple-600">{data.tds} PPM</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Usia Tanaman</h3>
            <p className="text-3xl font-bold text-orange-600">{data.usia} Hari</p>
          </div>
        </div>
      )}
    </div>
  );
}