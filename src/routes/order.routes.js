'use strict';
const express = require('express');
const {
    getAllOrderByIdUser,
    createOrder,
} = require('../controllers/order.controller');
const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(authentication);
//router.route('/:id').put().delete();
router.route('/').get(getAllOrderByIdUser).post(createOrder);

module.exports = router;
