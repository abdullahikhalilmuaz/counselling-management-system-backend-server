const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/chatController');

router.get('/users', protect, ctrl.chatUsers);
router.post('/send', protect, ctrl.send);
router.get('/inbox', protect, ctrl.inbox);
router.get('/conversation/:userId', protect, ctrl.conversation);
router.put('/read/:userId', protect, ctrl.markRead);

module.exports = router;
