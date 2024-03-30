'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { OK, CREATED } = require('../utils/success.response');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const getCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({
        user_id: req.user.id,
    });

    if (!cart)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: cart,
    }).send(res);
});

const addItemToCart = catchAsync(async (req, res, next) => {
    const productId = req.body.productId;
    const quantity = Number.parseInt(req.body.quantity) || 1;

    const foundProduct = await Product.findOne({
        _id: productId,
    });
    if (!foundProduct)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product Not Found');

    const price = foundProduct.price;

    let cart = await Cart.findOne().populate({
        path: 'items.product_id',
        select: 'id name price',
    });

    if (cart) {
        const indexFound = cart.items.findIndex(
            (item) => item.product_id._id.toString() === productId
        );

        if (indexFound !== -1) {
            cart.items[indexFound].quantity =
                cart.items[indexFound].quantity + quantity;
            cart.items[indexFound].price = price;
            cart.items[indexFound].total =
                cart.items[indexFound].quantity * price;
        } else if (quantity > 0) {
            cart.items.push({
                product_id: productId,
                quantity: quantity,
                price: price,
                total: Number.parseInt(price * quantity),
            });
        } else
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST
            );
    }
    cart.items.splice(0, 1);
    cart.save();
    return new OK({
        message: 'Add product to cart successfully',
        metadata: cart,
    }).send(res);
});

module.exports = { getCart, addItemToCart };
