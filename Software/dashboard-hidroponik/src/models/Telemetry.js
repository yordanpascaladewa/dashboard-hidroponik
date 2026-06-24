import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  suhu: { 
    type: Number, 
    required: true 
  },
  ph: { 
    type: Number, 
    required: true 
  },
  tds: { 
    type: Number, 
    required: true 
  },
  usia: { 
    type: Number, 
    default: 0 
  },
  status: {
    type: String,
    default: "RUNNING_NORMAL"
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Mengecek apakah model sudah ada sebelumnya untuk mencegah error "OverwriteModelError" di Next.js
const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);

export default Telemetry;