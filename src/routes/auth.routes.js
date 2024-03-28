'use strict';
const express = require('express');
const {
    register,
    logIn,
    logOut,
    refreshToken,
} = require('../controllers/auth.controller');

const router = express.Router();

router.route('/register').post(register);


router.route('/refresh').post(refreshToken);
router.route('/login').post(logIn);
router.route('/logout').post(logOut);

module.exports = router;
