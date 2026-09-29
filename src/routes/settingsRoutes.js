const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/settingsController');

router.get('/', protect, ctrl.get);
router.put('/', protect, allow('admin'), ctrl.update);

module.exports = router;
