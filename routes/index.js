const express = require('express');
const router = express.Router();

router.use('/courses', require('./course.js'));
router.use('/users', require('./user.js'));

module.exports = router;