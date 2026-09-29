const router = require('express').Router();
const limiter = require('../middleware/rateLimiter');
const ctrl = require('../controllers/passwordResetController');

router.post('/forgot', limiter, ctrl.forgot);
router.post('/reset',  limiter, ctrl.reset);

module.exports = router;
