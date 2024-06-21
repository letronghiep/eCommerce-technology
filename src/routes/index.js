'use strict';
const express = require('express');
const router = express.Router();

router.use('/v1/api/auth', require('./auth.routes'));
router.use('/v1/api/brand', require('./brand.routes'));
router.use('/v1/api/category', require('./category.routes'));
router.use('/v1/api/cart', require('./cart.routes'));
router.use('/v1/api/color', require('./color.routes'));
router.use('/v1/api/news', require('./news.routes'));
router.use('/v1/api/order', require('./order.routes'));
router.use('/v1/api/user', require('./user.routes'));
router.use('/v1/api/payment', require('./payment.routes'));
router.use('/v1/api/product', require('./product.routes'));
router.use('/v1/api/ratting', require('./ratting.routes'));
router.use('/v1/api/role', require('./role.routes'));
router.use('/v1/api/shipping', require('./shipping.routes'));
router.use('/v1/api/checkout', require('./checkout.routes'));
router.use('/v1/api/dashboard', require('./dashboard.routes'));

module.exports = router;
