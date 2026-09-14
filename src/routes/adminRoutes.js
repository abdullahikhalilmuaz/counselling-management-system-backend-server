const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/adminController');

router.use(protect, allow('admin'));
router.get('/stats', ctrl.stats);
router.get('/users', ctrl.users);
router.put('/users/:id/role', ctrl.updateRole);
router.delete('/users/:id', ctrl.removeUser);
router.get('/reports', ctrl.reports);

module.exports = router;
