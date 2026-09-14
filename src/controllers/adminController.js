const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');

exports.stats = async (req, res, next) => {
  try {
    const [students, counsellors, pending, completed] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'counsellor' }),
      Appointment.countDocuments({ status: 'pending' }),
      Session.countDocuments(),
    ]);
    res.json({ students, counsellors, pending, completed });
  } catch (err) { next(err); }
};

exports.users = async (req, res, next) => {
  try {
    const list = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'counsellor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(u);
  } catch (err) { next(err); }
};

exports.removeUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

exports.reports = async (req, res, next) => {
  try {
    const [total, approved, rejected, pending] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'approved' }),
      Appointment.countDocuments({ status: 'rejected' }),
      Appointment.countDocuments({ status: 'pending' }),
    ]);
    const feedbacks = await Feedback.find();
    const avgRating = feedbacks.length
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(2)
      : 0;
    res.json({ totalAppointments: total, approved, rejected, pending, avgRating });
  } catch (err) { next(err); }
};
