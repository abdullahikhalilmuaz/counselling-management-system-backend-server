const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/availabilityController');

router.get('/mine', protect, allow('counsellor'), ctrl.mine);
router.get('/counsellor/:id', protect, ctrl.byCounsellor);
router.post('/', protect, allow('counsellor'), ctrl.create);
router.put('/:id', protect, allow('counsellor'), ctrl.update);
router.delete('/:id', protect, allow('counsellor'), ctrl.remove);

module.exports = router;
