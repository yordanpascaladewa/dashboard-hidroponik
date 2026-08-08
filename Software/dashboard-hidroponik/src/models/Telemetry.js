import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  suhu: { type: Number, required: true },
  ph: { type: Number, required: true },
  tds: { type: Number, required: true },
  // 2 Laci baru untuk sistem daya (Power Analytics)
  voltaseBaterai: { type: Number, default: 0 }, 
  energiSolar: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);
export default Telemetry;