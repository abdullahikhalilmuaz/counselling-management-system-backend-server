const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  counsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dayOfWeek:  { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
  startTime:  { type: String, required: true },
  endTime:    { type: String, required: true },
  slotDuration: { type: Number, default: 60 },
  active:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
