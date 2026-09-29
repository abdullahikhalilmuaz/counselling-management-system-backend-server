const User = require('../models/User');

exports.avatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id, { avatar: url }, { new: true }
    ).select('-password');
    res.json({ url, user });
  } catch (err) { next(err); }
};
