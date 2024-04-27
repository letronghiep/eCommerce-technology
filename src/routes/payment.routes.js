'use strict';
const express = require('express');

const {} = require('../controllers/payment.controller');
const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(authentication);
router.route('/checkout-session/:orderId').get();

module.exports = router;
