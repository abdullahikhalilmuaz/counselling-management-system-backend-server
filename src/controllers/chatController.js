const Message = require('../models/Message');
const User = require('../models/User');

exports.send = async (req, res, next) => {
  try {
    const { to, body } = req.body;
    if (!to || !body) return res.status(400).json({ message: 'Recipient and body required' });
    const m = await Message.create({ from: req.user._id, to, body });
    res.status(201).json(m);
  } catch (err) { next(err); }
};

exports.conversation = async (req, res, next) => {
  try {
    const other = req.params.userId;
    const me = req.user._id;
    const messages = await Message.find({
      $or: [
        { from: me, to: other },
        { from: other, to: me },
      ],
    }).sort({ createdAt: 1 }).populate('from', 'name role');
    res.json(messages);
  } catch (err) { next(err); }
};

exports.inbox = async (req, res, next) => {
  try {
    const me = req.user._id;
    const msgs = await Message.find({ to: me })
      .sort({ createdAt: -1 })
      .populate('from', 'name role')
      .populate('to', 'name role');
    res.json(msgs);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      { from: req.params.userId, to: req.user._id, read: false },
      { read: true }
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
};

// Who can I chat with?
exports.chatUsers = async (req, res, next) => {
  try {
    const me = req.user;
    let filter = {};
    if (me.role === 'student') filter = { role: { $in: ['counsellor', 'admin'] } };
    else if (me.role === 'counsellor') filter = { role: { $in: ['student', 'admin'] } };
    else filter = { role: { $in: ['student', 'counsellor'] } };

    const list = await User.find({ ...filter, _id: { $ne: me._id } })
      .select('name email role specialty department avatar');
    res.json(list);
  } catch (err) { next(err); }
};
