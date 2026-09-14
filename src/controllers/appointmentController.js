const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.create = async (req, res, next) => {
  try {
    const { counsellor, date, time, reason } = req.body;
    if (!counsellor || !date || !time) {
      return res.status(400).json({ message: 'Counsellor, date and time are required' });
    }
    const clash = await Appointment.findOne({ counsellor, date, time, status: 'approved' });
    if (clash) return res.status(400).json({ message: 'Time slot already booked' });

    const appt = await Appointment.create({
      student: req.user._id, counsellor, date, time, reason,
    });
    await Notification.create({
      user: counsellor,
      message: `New appointment request from ${req.user.name} on ${date} at ${time}`,
    });
    res.status(201).json(appt);
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try {
    const list = await Appointment.find({ student: req.user._id })
      .populate('counsellor', 'name specialty email')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.counsellorList = async (req, res, next) => {
  try {
    const list = await Appointment.find({ counsellor: req.user._id })
      .populate('student', 'name email department')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.all = async (req, res, next) => {
  try {
    const list = await Appointment.find()
      .populate('student', 'name email')
      .populate('counsellor', 'name specialty')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appt.counsellor) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    appt.status = status;
    await appt.save();
    await Notification.create({
      user: appt.student,
      message: `Your appointment on ${appt.date} at ${appt.time} was ${status}`,
    });
    res.json(appt);
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appt.student) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    appt.status = 'cancelled';
    await appt.save();
    res.json(appt);
  } catch (err) { next(err); }
};

const SLOTS = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'];

exports.slots = async (req, res, next) => {
  try {
    const { counsellorId, date } = req.query;
    if (!counsellorId || !date) return res.status(400).json({ message: 'Missing params' });
    const booked = await Appointment.find({
      counsellor: counsellorId, date, status: 'approved',
    }).select('time');
    const bookedTimes = booked.map((b) => b.time);
    const available = SLOTS.filter((s) => !bookedTimes.includes(s));
    res.json({ slots: SLOTS, available });
  } catch (err) { next(err); }
};
