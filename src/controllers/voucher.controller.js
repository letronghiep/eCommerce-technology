'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Voucher = require('../models/voucher.model');
const User = require('../models/user.model');
const { OK, CREATED } = require('../utils/success.response');

const getAllVouchers = catchAsync(async (req, res, next) => {
    const vouchers = await Voucher.find()
        .select('code quantity type_of value expiration_date')
        .lean();
    if (!vouchers)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: vouchers,
    }).send(res);
});

const getVoucherByCode = catchAsync(async (req, res, next) => {
    const voucher = await Voucher.findOne({ code: req.params.code })
        .select('code type_of value expiration_date')
        .lean();

    const user = await User.findOne({ _id: req.user.id });
    if (user.rank === 'copper') {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            'Your rank is not enough to use the voucher'
        );
    }

    if (!voucher)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: voucher,
    }).send(res);
});

const createVoucher = catchAsync(async (req, res, next) => {
    const { code, quantity, type_of, value, expiration_date } = req.body;

    const newVoucher = await Voucher.create({
        code,
        quantity,
        type_of,
        value,
        expiration_date,
    });

    if (!newVoucher)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: newVoucher,
    }).send(res);
});

const updateVoucher = catchAsync(async (req, res, next) => {
    const voucherUpdate = await Voucher.findByIdAndUpdate(
        req.params.code,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    return new OK({
        message: ReasonPhrases.OK,
        metadata: voucherUpdate,
    }).send(res);
});

const deleteVoucher = catchAsync(async (req, res, next) => {
    await Voucher.findByIdAndUpdate(req.params.id, {
        status: 'disable',
    });

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
        voucher: null,
    });
});

module.exports = {
    getAllVouchers,
    getVoucherByCode,
    createVoucher,
    updateVoucher,
    deleteVoucher,
};
