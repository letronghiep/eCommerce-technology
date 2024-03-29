'use strict';
const express = require('express');
const {
    register,
    logIn,
    logOut,
    refreshToken,
} = require('../controllers/auth.controller');
const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(logIn);
router.use(authentication)
router.route('/refresh').post( refreshToken);
router.route('/logout').post( logOut);

module.exports = router;
