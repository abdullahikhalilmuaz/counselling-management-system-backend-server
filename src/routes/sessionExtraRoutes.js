const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/sessionExtraController');

router.put('/:id',    protect, allow('counsellor'), ctrl.updateNotes);
router.delete('/:id', protect, allow('counsellor'), ctrl.remove);

module.exports = router;
