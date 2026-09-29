const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

exports.reschedule = async (req, res, next) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) return res.status(400).json({ message: 'Date and time required' });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appt.student) !== String(req.user._id))
      return res.status(403).json({ message: 'Not your appointment' });

    const clash = await Appointment.findOne({
      counsellor: appt.counsellor, date, time, status: 'approved', _id: { $ne: appt._id },
    });
    if (clash) return res.status(400).json({ message: 'Slot already booked' });

    appt.date = date;
    appt.time = time;
    appt.status = 'pending';
    await appt.save();

    await Notification.create({
      user: appt.counsellor,
      message: `Appointment rescheduled by student to ${date} at ${time}`,
    });

    res.json(appt);
  } catch (err) { next(err); }
};

exports.bulkStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !status)
      return res.status(400).json({ message: 'ids and status required' });
    const result = await Appointment.updateMany(
      { _id: { $in: ids }, counsellor: req.user._id },
      { status }
    );
    res.json({ ok: true, modified: result.modifiedCount });
  } catch (err) { next(err); }
};
