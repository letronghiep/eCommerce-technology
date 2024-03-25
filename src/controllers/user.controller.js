'use strict';

const bcrypt = require('bcrypt');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

exports.getAllUsers = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        message: 'Success',
        user: user,
    });
});

exports.createUser = async (req, res) => {};

exports.updateUser = async (req, res) => {};

exports.deleteUser = async (req, res) => {};
