const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/appointmentExtraController');

router.put('/:id/reschedule', protect, allow('student'), ctrl.reschedule);
router.put('/bulk/status',     protect, allow('counsellor'), ctrl.bulkStatus);

module.exports = router;
