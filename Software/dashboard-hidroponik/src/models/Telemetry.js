import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  suhu: { type: Number, required: true, default: 0 },
  ph: { type: Number, required: true, default: 0 },
  tds: { type: Number, required: true, default: 0 },
  usia: { type: Number, default: 0 },
  status: { type: String, default: "STANDBY" },
  timestamp: { type: Date, default: Date.now }
});

const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);

export default Telemetry;