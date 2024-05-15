'use strict';
const express = require('express');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');
const {
    getCart,
    addItemToCart,
    deleteItemToCart,
    emptyCart,
} = require('../controllers/cart.controller');

const router = express.Router();

router.use(authentication);
router
    .route('/')
    .get(getCart)
    .post(addItemToCart)
    .put(deleteItemToCart)
    .delete(emptyCart);

module.exports = router;
