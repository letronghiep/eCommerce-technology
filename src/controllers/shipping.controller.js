'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Shipping = require('../models/shipping.model');
const { OK, CREATED } = require('../utils/success.response');

const getAllAddressShipping = catchAsync(async (req, res, next) => {
    const addresses = await Shipping.findOne({ user_id: req.user.id }).sort({
        createdAt: -1,
    });

    if (!addresses)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: addresses,
    }).send(res);
});

const createAddressShipping = catchAsync(async (req, res, next) => {
    const newAddressShipping = await Shipping.create({
        user_id: req.user.id,
        recipient_name: req.body.recipient_name,
        phone_number: req.body.phone_number,
        address: req.body.address,
    });

    if (!newAddressShipping)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: newAddressShipping,
    }).send(res);
});

const updateAddressShipping = catchAsync(async (req, res, next) => {
    const addressShippingUpdate = await Shipping.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    return new OK({
        message: ReasonPhrases.OK,
        metadata: addressShippingUpdate,
    }).send(res);
});

const deleteAddressShipping = catchAsync(async (req, res, next) => {
    await Shipping.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
    });
});

module.exports = {
    getAllAddressShipping,
    createAddressShipping,
    updateAddressShipping,
    deleteAddressShipping,
};
