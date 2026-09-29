const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, specialty } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({
      name, email, password, role: role || 'student', department, specialty,
    });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
    });
  } catch (err) { next(err); }
};

exports.suspend = async (req, res, next) => {
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id, { suspended: true }, { new: true }
    ).select('-password');
    res.json(u);
  } catch (err) { next(err); }
};

exports.activate = async (req, res, next) => {
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id, { suspended: false }, { new: true }
    ).select('-password');
    res.json(u);
  } catch (err) { next(err); }
};

exports.filterAppointments = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const { status, counsellor, from, to } = req.query;
    const q = {};
    if (status)     q.status = status;
    if (counsellor) q.counsellor = counsellor;
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = from;
      if (to)   q.date.$lte = to;
    }
    const [items, total] = await Promise.all([
      Appointment.find(q)
        .populate('student', 'name email')
        .populate('counsellor', 'name specialty')
        .sort({ date: -1 }).skip(skip).limit(limit),
      Appointment.countDocuments(q),
    ]);
    res.json({ items, page, limit, total });
  } catch (err) { next(err); }
};

exports.userList = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const { role, search } = req.query;
    const q = {};
    if (role) q.role = role;
    if (search) q.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
    const [items, total] = await Promise.all([
      User.find(q).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(q),
    ]);
    res.json({ items, page, limit, total });
  } catch (err) { next(err); }
};
