const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  institutionName:  { type: String,  default: 'Institution' },
  workingHours:     { type: String,  default: '09:00 - 17:00' },
  timezone:         { type: String,  default: 'Africa/Lagos' },
  supportEmail:     { type: String,  default: '' },
  allowRegistration:{ type: Boolean, default: true },
  sessionDuration:  { type: Number,  default: 60 },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
