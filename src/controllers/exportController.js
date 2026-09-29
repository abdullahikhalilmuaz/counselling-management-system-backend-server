const Appointment = require('../models/Appointment');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');
const { toCSV } = require('../services/csvService');

exports.appointmentsCSV = async (_req, res, next) => {
  try {
    const list = await Appointment.find()
      .populate('student', 'name email')
      .populate('counsellor', 'name email')
      .lean();
    const rows = list.map((a) => ({
      id: a._id.toString(),
      student: a.student?.name || '',
      studentEmail: a.student?.email || '',
      counsellor: a.counsellor?.name || '',
      counsellorEmail: a.counsellor?.email || '',
      date: a.date, time: a.time, status: a.status, reason: a.reason || '',
    }));
    const csv = toCSV(rows, ['id','student','studentEmail','counsellor','counsellorEmail','date','time','status','reason']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="appointments.csv"');
    res.send(csv);
  } catch (err) { next(err); }
};

exports.sessionsCSV = async (_req, res, next) => {
  try {
    const list = await Session.find()
      .populate('student', 'name')
      .populate('counsellor', 'name')
      .lean();
    const rows = list.map((s) => ({
      id: s._id.toString(),
      student: s.student?.name || '',
      counsellor: s.counsellor?.name || '',
      notes: s.notes || '',
      recommendation: s.recommendation || '',
      nextVisit: s.nextVisit || '',
      createdAt: s.createdAt,
    }));
    const csv = toCSV(rows, ['id','student','counsellor','notes','recommendation','nextVisit','createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sessions.csv"');
    res.send(csv);
  } catch (err) { next(err); }
};

exports.feedbackCSV = async (_req, res, next) => {
  try {
    const list = await Feedback.find()
      .populate('student', 'name')
      .populate('counsellor', 'name')
      .lean();
    const rows = list.map((f) => ({
      id: f._id.toString(),
      student: f.student?.name || '',
      counsellor: f.counsellor?.name || '',
      rating: f.rating,
      comment: f.comment || '',
      createdAt: f.createdAt,
    }));
    const csv = toCSV(rows, ['id','student','counsellor','rating','comment','createdAt']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="feedback.csv"');
    res.send(csv);
  } catch (err) { next(err); }
};

exports.sessionSummaryJSON = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('student', 'name email department')
      .populate('counsellor', 'name specialty')
      .lean();
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) { next(err); }
};
