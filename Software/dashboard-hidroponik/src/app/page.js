'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  // State untuk menyimpan data sensor dari database
  const [data, setData] = useState({ suhu: 0, ph: 0, tds: 0, usia: 0 });
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menarik data dari API yang sudah kita buat sebelumnya
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data telemetri:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Opsional: Refresh data otomatis setiap 30 detik agar sesuai dengan interval ESP32
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Hidroponik</h1>
        <p className="text-gray-500">Sistem Telemetri & Embedded Data Management</p>
      </header>

      {loading ? (
        <div className="text-gray-600">Memuat data sensor...</div>
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