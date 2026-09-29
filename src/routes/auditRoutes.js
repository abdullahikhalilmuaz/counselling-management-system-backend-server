const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const allow = require('../middleware/roleMiddleware');
const paginate = require('../middleware/paginate');
const ctrl = require('../controllers/auditController');

router.get('/', protect, allow('admin'), paginate(50), ctrl.list);

module.exports = router;
