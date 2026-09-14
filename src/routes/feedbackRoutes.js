const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/feedbackController');

router.post('/', protect, allow('student'), ctrl.create);
router.get('/mine', protect, allow('student'), ctrl.mine);
router.get('/', protect, allow('admin'), ctrl.all);

module.exports = router;
