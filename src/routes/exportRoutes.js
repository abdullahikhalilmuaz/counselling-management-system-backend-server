const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/exportController');

router.get('/appointments.csv', protect, allow('admin'), ctrl.appointmentsCSV);
router.get('/sessions.csv',     protect, allow('admin'), ctrl.sessionsCSV);
router.get('/feedback.csv',     protect, allow('admin'), ctrl.feedbackCSV);
router.get('/session/:id',      protect, ctrl.sessionSummaryJSON);

module.exports = router;
