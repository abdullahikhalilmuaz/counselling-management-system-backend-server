const Session = require('../models/Session');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

exports.create = async (req, res, next) => {
  try {
    const { appointment, notes, recommendation, nextVisit } = req.body;
    if (!appointment || !notes) {
      return res.status(400).json({ message: 'Appointment and notes required' });
    }
    const appt = await Appointment.findById(appointment);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appt.counsellor) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your appointment' });
    }
    const session = await Session.create({
      appointment: appt._id,
      student: appt.student,
      counsellor: appt.counsellor,
      notes, recommendation, nextVisit,
    });
    await Notification.create({
      user: appt.student,
      message: `Session notes have been added for your appointment on ${appt.date}`,
    });
    res.status(201).json(session);
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try {
    const list = await Session.find({ student: req.user._id })
      .populate('counsellor', 'name specialty')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.counsellorList = async (req, res, next) => {
  try {
    const list = await Session.find({ counsellor: req.user._id })
      .populate('student', 'name email department')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.byAppointment = async (req, res, next) => {
  try {
    const s = await Session.findOne({ appointment: req.params.appointmentId });
    res.json(s);
  } catch (err) { next(err); }
};
