'use strict';
const express = require('express');
const router = express.Router();

router.use('/v1/api/role', require('./role.routes'));
router.use('/v1/api/auth', require('./auth.routes'));
router.use('/v1/api/user', require('./user.routes'));

module.exports = router;
