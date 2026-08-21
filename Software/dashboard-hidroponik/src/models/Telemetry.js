import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  suhu: { type: Number, required: true },
  ph: { type: Number, required: true },
  tds: { type: Number, required: true },
  voltaseBaterai: { type: Number, default: 0 }, 
  energiSolar: { type: Number, default: 0 },
  
  // --- TAMBAHAN LACI BARU UNTUK ESP32 ---
  usia_hari: { type: Number, default: 0 },
  tanaman: { type: String, default: 'STANDBY' },
  raw_volt_ph: { type: Number, default: 0 },
  raw_volt_tds: { type: Number, default: 0 },
  raw_adc_ph: { type: Number, default: 0 },
  raw_adc_tds: { type: Number, default: 0 },
  // -------------------------------------
  
  timestamp: { type: Date, default: Date.now }
});

const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);
export default Telemetry;