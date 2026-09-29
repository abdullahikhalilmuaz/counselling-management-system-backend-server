const Availability = require('../models/Availability');

exports.create = async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime, slotDuration } = req.body;
    const a = await Availability.create({
      counsellor: req.user._id, dayOfWeek, startTime, endTime,
      slotDuration: slotDuration || 60,
    });
    res.status(201).json(a);
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try {
    const list = await Availability.find({ counsellor: req.user._id }).sort({ dayOfWeek: 1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.byCounsellor = async (req, res, next) => {
  try {
    const list = await Availability.find({ counsellor: req.params.id, active: true });
    res.json(list);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const a = await Availability.findOneAndUpdate(
      { _id: req.params.id, counsellor: req.user._id },
      req.body, { new: true }
    );
    if (!a) return res.status(404).json({ message: 'Availability not found' });
    res.json(a);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Availability.findOneAndDelete({ _id: req.params.id, counsellor: req.user._id });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
