'use strict';
const express = require('express');
const authentication = require('../middlewares/authentication.middleware');
const { getCart, addItemToCart } = require('../controllers/cart.controller');

const router = express.Router();

router.use(authentication);
router.route('/').get(getCart).post(addItemToCart);

module.exports = router;
