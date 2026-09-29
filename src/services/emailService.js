let transporter = null;

try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
} catch (_) {}

async function sendMail({ to, subject, text }) {
  if (!transporter) {
    console.log('[email:stub]', { to, subject, text });
    return { stubbed: true };
  }
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@counsellease.local',
    to, subject, text,
  });
}

module.exports = { sendMail };
