const AuditLog = require('../models/AuditLog');

module.exports = function audit(action, resource) {
  return (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode < 400 && req.user) {
        try {
          await AuditLog.create({
            user: req.user._id,
            action,
            resource,
            resourceId: req.params.id || null,
            meta: req.body && typeof req.body === 'object'
              ? Object.keys(req.body) : null,
            ip: req.ip,
          });
        } catch (_) {}
      }
    });
    next();
  };
};
