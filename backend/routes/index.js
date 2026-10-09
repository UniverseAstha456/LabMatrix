const router = require('express').Router();

router.use('/batches', require('./batch.routes'));
router.use('/courses', require('./course.routes'));
// router.use('/auth', require('./auth.routes'));   // your teammate adds this

module.exports = router;