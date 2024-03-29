'use strict';
const express = require('express');
const {
    register,
    logIn,
    logOut,
    refreshToken,
} = require('../controllers/auth.controller');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(logIn);

router.route('/refresh').post(checkAuth, refreshToken);
router.route('/logout').post(checkAuth, logOut);

module.exports = router;
