const crypto = require('crypto');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { sendMail } = require('../services/emailService');

exports.forgot = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always return ok to avoid user enumeration
    if (!user) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await PasswordReset.create({ user: user._id, token, expiresAt });

    const link = `${process.env.CLIENT_URL || ''}/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: 'Password Reset — CounselEase',
      text: `Reset your password using this link: ${link}`,
    });

    res.json({ ok: true, token: process.env.NODE_ENV === 'development' ? token : undefined });
  } catch (err) { next(err); }
};

exports.reset = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password required' });

    const entry = await PasswordReset.findOne({ token, used: false });
    if (!entry || entry.expiresAt < new Date())
      return res.status(400).json({ message: 'Invalid or expired token' });

    const user = await User.findById(entry.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();

    entry.used = true;
    await entry.save();

    res.json({ ok: true });
  } catch (err) { next(err); }
};
