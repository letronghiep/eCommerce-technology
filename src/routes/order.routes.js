'use strict';
const express = require('express');
const {
    getAllOrderById,
    createOrder,
    deleteOrderById,
} = require('../controllers/order.controller');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(authentication);
router.route('/:id').delete(deleteOrderById);
router.route('/').get(getAllOrderById).post(createOrder);

module.exports = router;
