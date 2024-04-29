'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const News = require('../models/news.model');
const { OK, CREATED } = require('../utils/success.response');

const getAllNews = catchAsync(async (req, res, next) => {
    const news = await News.find({ status: 'active' }).sort({ createAt: -1 });
    if (!news)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: news,
    }).send(res);
});

const getNewsById = catchAsync(async (req, res, next) => {
    const news = await News.findOne({ _id: req.params.id });

    if (!news)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: news,
    }).send(res);
});

const getAllNewsByUser = catchAsync(async (req, res, next) => {
    const news = await News.find({ user_id: req.user.id }).sort({
        createAt: -1,
    });

    if (!news)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: news,
    }).send(res);
});

const createNews = catchAsync(async (req, res, next) => {
    const { title, description, content } = req.body;
    const user_id = req.user.id;
    const avatar = req.urlFile.avatar;

    const createNews = await News.create({
        user_id,
        avatar,
        title,
        description,
        content,
    });

    if (!createNews)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: createNews,
    }).send(res);
});

const updateNews = catchAsync(async (req, res, next) => {
    const updateNews = await News.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return new OK({
        message: ReasonPhrases.OK,
        metadata: updateNews,
    }).send(res);
});

const deleteNews = catchAsync(async (req, res, next) => {
    await News.findByIdAndUpdate(req.params.id, {
        status: 'block',
    });

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
        metadata: null,
    });
});

module.exports = {
    getAllNews,
    getNewsById,
    getAllNewsByUser,
    createNews,
    updateNews,
    deleteNews,
};
