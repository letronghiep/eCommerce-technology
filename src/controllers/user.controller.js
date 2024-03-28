'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().lean();

    if (!users)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        quantity: users.length,
        users: users,
    });
});

const getUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id });

    if (!user)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        user: user,
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        user: userUpdate,
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    // await User.findByIdAndUpdate(req.params.id, {
    //     status: block,
    // });

    await User.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
        user: null,
    });
});

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
