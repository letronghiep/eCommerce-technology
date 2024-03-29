'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/shoppingCart.model');
const { OK, CREATED } = require('../utils/success.response');

const getCart = catchAsync(async (req, res, next) => {});

const createCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.create({
        user_id: req.user.id,
    });
});
module.exports = { getCart, createCart };
