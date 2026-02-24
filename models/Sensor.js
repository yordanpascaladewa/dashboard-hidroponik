import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
  ph: { type: Number, required: true },
  ec: { type: Number, required: true },
  suhu: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Sensor || mongoose.model('Sensor', SensorSchema);