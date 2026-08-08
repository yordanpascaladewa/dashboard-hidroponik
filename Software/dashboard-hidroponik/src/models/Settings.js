import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  settingId: { type: String, required: true, unique: true },
  isPlantingActive: { type: Boolean, default: false }, // Penanda apakah lagi nanam atau belum
  komoditas: { type: String, default: 'Pakcoy' },
  umurBibit: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;