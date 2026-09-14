const Feedback = require('../models/Feedback');
const Session = require('../models/Session');

exports.create = async (req, res, next) => {
  try {
    const { session, rating, comment } = req.body;
    if (!session || !rating) {
      return res.status(400).json({ message: 'Session and rating required' });
    }
    const s = await Session.findById(session);
    if (!s) return res.status(404).json({ message: 'Session not found' });
    const exists = await Feedback.findOne({ session });
    if (exists) return res.status(400).json({ message: 'Feedback already submitted' });

    const fb = await Feedback.create({
      student: req.user._id,
      counsellor: s.counsellor,
      session, rating, comment,
    });
    res.status(201).json(fb);
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try {
    const list = await Feedback.find({ student: req.user._id })
      .populate('counsellor', 'name specialty')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.all = async (req, res, next) => {
  try {
    const list = await Feedback.find()
      .populate('student', 'name')
      .populate('counsellor', 'name')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};
