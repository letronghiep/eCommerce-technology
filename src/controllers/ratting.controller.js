'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { OK, CREATED } = require('../utils/success.response');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const Ratting = require('../models/ratting.model');

const getAllRattings = catchAsync(async (req, res, next) => {
    const filter = { product_id: req.body.product_id };

    const features = new ApiFeatures(Ratting.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const rattings = await features.query;

    return new OK({
        message: 'Rattings list in product',
        metadata: rattings,
    }).send(res);
});

const getRatting = catchAsync(async (req, res, next) => {
    const ratting = await Ratting.findOne({ _id: req.params.id });

    if (!ratting)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: ratting,
    }).send(res);
});

const createRatting = catchAsync(async (req, res, next) => {
    const gallery = req.urlFile.gallery;
    const { product_id, ratting, comment } = req.body;

    const newRatting = await Ratting.create({
        product_id,
        user_id: req.user.id,
        ratting,
        comment,
        gallery,
    });

    if (!newRatting)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: newRatting,
    }).send(res);
});

const updateRatting = catchAsync(async (req, res, next) => {
    const rattingUpdate = await Ratting.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    return new OK({
        message: ReasonPhrases.OK,
        metadata: rattingUpdate,
    }).send(res);
});

const deleteRatting = catchAsync(async (req, res, next) => {
    await Ratting.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
        ratting: null,
    });
});

module.exports = {
    getAllRattings,
    getRatting,
    createRatting,
    updateRatting,
    deleteRatting,
};
