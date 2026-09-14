const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/notificationController');

router.get('/', protect, ctrl.mine);
router.put('/read-all', protect, ctrl.markAllRead);
router.put('/:id/read', protect, ctrl.markRead);

module.exports = router;
