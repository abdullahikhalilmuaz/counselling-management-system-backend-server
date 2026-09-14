const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/appointmentController');

router.post('/', protect, allow('student'), ctrl.create);
router.get('/mine', protect, allow('student'), ctrl.mine);
router.get('/counsellor', protect, allow('counsellor'), ctrl.counsellorList);
router.get('/slots', protect, ctrl.slots);
router.get('/', protect, allow('admin'), ctrl.all);
router.put('/:id/status', protect, allow('counsellor', 'admin'), ctrl.updateStatus);
router.delete('/:id', protect, allow('student', 'admin'), ctrl.cancel);

module.exports = router;
