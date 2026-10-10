const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/batches', require('./batch.routes'));
router.use('/courses', require('./course.routes'));
router.use('/views', require('./views.routes'));   // only if you've created views.routes.js

module.exports = router;