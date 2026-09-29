const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/authController');
const uploadCtrl = require('../controllers/uploadController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', protect, ctrl.me);
router.put('/profile', protect, ctrl.updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadCtrl.avatar);
router.get('/counsellors', protect, ctrl.listCounsellors);

module.exports = router;
