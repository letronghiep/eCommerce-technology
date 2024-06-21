'use strict';
const express = require('express');
const {
    createCheckout,
    returnVnpCheckout,
} = require('../controllers/checkout.controller.js');

const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const router = express.Router();

router.get('/thanks', returnVnpCheckout);
router.post('/', authentication, createCheckout);
module.exports = router;
