import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  settingId: { type: String, default: 'GLOBAL_CONFIG' },
  targetTanaman: { type: String, default: 'SELADA' },
  targetHari: { type: Number, default: 30 },
  // Tambahan state untuk aktuator fisik (relay)
  actuators: {
    pump: { type: Boolean, default: true },
    led: { type: Boolean, default: true },
    doser: { type: Boolean, default: false },
    fan: { type: Boolean, default: true }
  },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings;