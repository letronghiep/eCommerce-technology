'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const { OK, CREATED } = require('../utils/success.response');

const getAllOrder = catchAsync(async (req, res, next) => {
    const orders = await Order.find().sort({ order_date: -1 }).lean();

    if (!orders) throw new ApiError(StatusCodes.NOT_FOUND, 'Order Not Found');

    return new OK({
        message: ReasonPhrases.OK,
        metadata: orders,
    }).send(res);
});

const getAllOrderByUser = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user_id: req.user.id })
        .sort({
            order_date: -1,
        })
        .lean();

    if (!orders) throw new ApiError(StatusCodes.NOT_FOUND, 'Order Not Found');

    return new OK({
        message: ReasonPhrases.OK,
        metadata: orders,
    }).send(res);
});

const getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findOne({ _id: req.params.id }).lean();

    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order Not Found');

    return new OK({
        message: ReasonPhrases.OK,
        metadata: order,
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
        shipping_id,
    });

    if (!newOrder)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    cart.items = [];
    cart.save();

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: newOrder,
    }).send(res);
});

const updateStatusOrder = catchAsync(async (req, res, next) => {
    const orderUpdate = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return new OK({
        message: ReasonPhrases.OK,
        metadata: orderUpdate,
    }).send(res);
});

module.exports = {
    getAllOrder,
    getAllOrderByUser,
    getOrderById,
    createOrder,
    updateStatusOrder,
};
