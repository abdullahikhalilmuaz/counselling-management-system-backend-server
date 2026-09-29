const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const paginate = require('../middleware/paginate');
const ctrl = require('../controllers/adminExtraController');

router.use(protect, allow('admin'));

router.post('/users', ctrl.createUser);
router.put('/users/:id/suspend', ctrl.suspend);
router.put('/users/:id/activate', ctrl.activate);
router.get('/users', paginate(20), ctrl.userList);
router.get('/appointments', paginate(20), ctrl.filterAppointments);

module.exports = router;
