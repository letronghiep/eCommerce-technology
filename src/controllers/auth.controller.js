'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

// CREATE A NEW USER
const register = catchAsync(async (req, res, next) => {
    const username = req.body.username.toLowerCase();
    const user = await User.findOne({ username: username });

    if (user)
        throw new ApiError(
            StatusCodes.CONFLICT,
            `User ${username} is already registered`
        );
    else {
        const hashPassword = bcrypt.hashSync(req.body.password, 12);
        const roleCode = '6604388125b88d9950f0a958';
        const newUser = await User.create({
            full_name: req.body.full_name,
            username: req.body.username,
            password: hashPassword,
            phone_number: req.body.phone_number,
            email: req.body.email,
            role_code: roleCode,
        });

        if (!newUser)
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST
            );

        res.status(StatusCodes.CREATED).json({
            message: ReasonPhrases.CREATED,
            user: newUser,
        });
    }
});

// LOGIN
const logIn = catchAsync(async (req, res, next) => {
    const username = req.body.username.trim().toLowerCase() || 'abcdef';
    const password = req.body.password || '123456';

    const user = await User.findOne({ username: username });
    if (!user)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            `User ${username} not found`
        );

    const isMathPassword = bcrypt.compareSync(password, user.password);
    if (!isMathPassword)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            `Password is incorrect, please try again...`
        );

    const accessToken = await jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60,
            data: {
                id: user._id,
                username: user.username,
            },
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    if (!accessToken)
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            `Login unsuccessful, please try again...`
        );
    await User.findByIdAndUpdate(user._id, { access_token: accessToken });

    const refreshToken = await jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            data: {
                id: user._id,
                username: user.username,
            },
        },
        process.env.ACCESS_REFRESH_TOKEN_SECRET
    );
    await User.findByIdAndUpdate(user._id, { refresh_token: refreshToken });

    req.user = user;
    res.status(StatusCodes.OK).json({
        message: 'Login successful',
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
    });
});

const refreshToken = catchAsync(async (req, res, next) => {
    const accessToken = req.headers.x_authorization;
    if (!accessToken)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Access token not found...'
        );

    const refreshToken = req.body.refresh_token;
    if (!refreshToken)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Refrest token not found...'
        );

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid access token ...');

    const username = decoded.data;
    const user = await User.findOne({ username: username });
    if (!user)
        throw new ApiError(StatusCodes.NOT_FOUND, `User ${username} not found`);

    if (refreshToken !== user.refresh_token)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Invalid refrest token ...'
        );

    const accessTokenNew = await jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60,
            data: {
                id: user._id,
                username: user.username,
            },
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    if (!accessTokenNew)
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            `Creating access token failed, please try again...`
        );
    await User.findByIdAndUpdate(user._id, { access_token: accessTokenNew });

    res.status(StatusCodes.OK).json({
        message: 'Refresh token successfully',
        accessToken: accessTokenNew,
    });
});

const logOut = catchAsync(async (req, res, next) => {
    res.json({
        success: 'abc',
    });
});

module.exports = { register, logIn, logOut, refreshToken };
