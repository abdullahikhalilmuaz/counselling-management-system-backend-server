const Session = require('../models/Session');

exports.updateNotes = async (req, res, next) => {
  try {
    const { notes, recommendation, nextVisit } = req.body;
    const s = await Session.findOne({ _id: req.params.id, counsellor: req.user._id });
    if (!s) return res.status(404).json({ message: 'Session not found' });
    if (notes !== undefined) s.notes = notes;
    if (recommendation !== undefined) s.recommendation = recommendation;
    if (nextVisit !== undefined) s.nextVisit = nextVisit;
    await s.save();
    res.json(s);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const s = await Session.findOneAndDelete({
      _id: req.params.id, counsellor: req.user._id,
    });
    if (!s) return res.status(404).json({ message: 'Session not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
