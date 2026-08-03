'use client';
import { FiAlertOctagon } from 'react-icons/fi';

export default function CommandCenterPage() {
  const handleEmergencyStop = (actuator) => {
    alert(`MENGIRIM PERINTAH DARURAT: Mematikan ${actuator} secara paksa lewat protokol MQTT!`);
    // Integrasi logika fetch API/MQTT override di sini
  };

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FiAlertOctagon className="text-red-500" /> Command Center Darurat
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Gunakan panel ini <strong>HANYA</strong> jika terjadi *error* pada algoritma otomatis yang menyebabkan *overdosis* nutrisi atau kebocoran tandon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tombol Matikan Pompa TDS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Override Pompa Nutrisi (TDS)</h3>
            <p className="text-sm text-gray-500 mb-6">Matikan aliran pupuk cair jika kadar PPM melebihi ambang batas maksimal tanaman.</p>
          </div>
          <button 
            onClick={() => handleEmergencyStop('POMPA NUTRISI TDS')}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            MATIKAN POMPA TDS
          </button>
        </div>

        {/* Tombol Matikan Pompa Air */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Override Pompa Sirkulasi Air</h3>
            <p className="text-sm text-gray-500 mb-6">Matikan sirkulasi air utama jika terjadi indikasi luber atau malfungsi sensor pada tandon.</p>
          </div>
          <button 
            onClick={() => handleEmergencyStop('POMPA AIR UTAMA')}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            MATIKAN POMPA AIR
          </button>
        </div>
      </div>
    </div>
  );
}