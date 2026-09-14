const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const safeRole = ['student', 'counsellor', 'admin'].includes(role) ? role : 'student';
    const user = await User.create({ name, email, password, role: safeRole });
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, department, specialty } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (specialty !== undefined) user.specialty = specialty;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, department: user.department, specialty: user.specialty });
  } catch (err) { next(err); }
};

exports.listCounsellors = async (req, res, next) => {
  try {
    const list = await User.find({ role: 'counsellor' }).select('-password');
    res.json(list);
  } catch (err) { next(err); }
};
