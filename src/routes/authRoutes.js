const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', protect, ctrl.me);
router.put('/profile', protect, ctrl.updateProfile);
router.get('/counsellors', protect, ctrl.listCounsellors);

module.exports = router;
