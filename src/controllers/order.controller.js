'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Shipping = require('../models/shipping.model');
const { OK, CREATED } = require('../utils/success.response');

const getAllOrderByIdUser = catchAsync(async (req, res, next) => {
    const orders = await Order.findOne({ _id: req.user.id }).sort({
        order_date: -1,
    });

    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order Not Found');

    return new OK({
        message: ReasonPhrases.OK,
        metadata: orders,
    }).send(res);
});

const createOrder = catchAsync(async (req, res, next) => {
    const { total_price, shipping_costs, shipping_id } = req.body;

    const cart = await Cart.findOne({
        user_id: req.user.id,
    });

    if (!cart)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'No cart or shipping');

    const newOrder = await Order.create({
        user_id: req.user.id,
        products: cart.items,
        total_price,
        shipping_costs,
        shipping: shipping_id,
    });

    if (!newOrder)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: newOrder,
    }).send(res);
});

const updateAddressOrder = catchAsync(async (req, res, next) => {
    const addressOrderUpdate = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    return new OK({
        message: ReasonPhrases.OK,
        metadata: addressOrderUpdate,
    }).send(res);
});

const deleteAddressOrder = catchAsync(async (req, res, next) => {
    await Order.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
    });
});

module.exports = {
    getAllOrderByIdUser,
    createOrder,
};
