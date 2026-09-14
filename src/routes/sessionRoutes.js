const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/sessionController');

router.post('/', protect, allow('counsellor'), ctrl.create);
router.get('/mine', protect, allow('student'), ctrl.mine);
router.get('/counsellor', protect, allow('counsellor'), ctrl.counsellorList);
router.get('/appointment/:appointmentId', protect, ctrl.byAppointment);

module.exports = router;
