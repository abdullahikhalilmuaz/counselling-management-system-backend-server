const AuditLog = require('../models/AuditLog');

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const [items, total] = await Promise.all([
      AuditLog.find().populate('user', 'name email role')
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(),
    ]);
    res.json({ items, page, limit, total });
  } catch (err) { next(err); }
};
