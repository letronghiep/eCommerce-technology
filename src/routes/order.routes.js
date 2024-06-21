'use strict';
const express = require('express');
const {
    getAllOrderByUser,
    getOrderById,
    createOrder,
} = require('../controllers/order.controller');

const { authentication } = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(authentication);
router.route('/:id').get(getOrderById);
router.route('/').get(getAllOrderByUser).post(createOrder);

module.exports = router;
