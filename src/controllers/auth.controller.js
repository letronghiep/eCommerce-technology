'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { OK, CREATED } = require('../utils/success.response');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Role = require('../models/role.model');

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
        const roleCode = await Role.findOne({
            name: 'user',
            status: 'active',
        });
        const newUser = await User.create({
            full_name: req.body.full_name,
            username: req.body.username,
            password: hashPassword,
            phone_number: req.body.phone_number,
            email: req.body.email,
            role_code: roleCode._id,
        });

        if (!newUser)
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                ReasonPhrases.BAD_REQUEST
            );
        // Create cart

        const cart = await Cart.create({
            user_id: newUser._id,
        });

        return new CREATED({
            message: 'User created successfully',
            metadata: {
                user: newUser,
                cart: cart,
            },
        }).send(res);
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

    const role = await Role.findOne({ _id: user.role_code });
    const dataToken = {
        id: user._id,
        username: user.username,
        role: role.name,
    };
    const accessToken = await jwt.sign(
        dataToken,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_TIMEOUT }
    );

    if (!accessToken)
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            `Login unsuccessful, please try again...`
        );
    await User.findByIdAndUpdate(user._id, { access_token: accessToken });

    const refreshToken = await jwt.sign(
        dataToken,
        process.env.ACCESS_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_REFRESH_TOKEN_TIMEOUT }
    );
    await User.findByIdAndUpdate(user._id, { refresh_token: refreshToken });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return new OK({
        message: 'Login successful',
        metadata: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user,
        },
    }).send(res);
});

const refreshToken = catchAsync(async (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    if (!authHeaders)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Invalid authorization header'
        );

    const accessToken = authHeaders.split(' ')[1];
    if (!accessToken)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED
        );

    const refreshToken = req.cookies.jwt;
    if (!refreshToken)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Refrest token not found...'
        );

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid access token ...');

    if (req.user.username !== decoded.username)
        throw new ApiError(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);

    const dataToken = {
        id: decoded.username._id,
        username: decoded.username.username,
    };
    const accessTokenNew = await jwt.sign(
        dataToken,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_TIMEOUT }
    );

    if (!accessTokenNew)
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            `Creating access token failed, please try again...`
        );
    await User.findByIdAndUpdate(decoded.username._id, {
        access_token: accessTokenNew,
    });
    return new OK({
        message: 'Refresh token successfully',
        metadata: accessTokenNew,
    }).send(res);
});

const logOut = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken)
        res.status(StatusCodes.NO_CONTENT).json({
            message: ReasonPhrases.NO_CONTENT,
        });

    const foundUser = await User.findOne({ refresh_token: refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.status(StatusCodes.NO_CONTENT).json({
            message: ReasonPhrases.NO_CONTENT,
        });
    } else {
        await User.findByIdAndUpdate(foundUser._id, {
            access_token: null,
            refresh_token: null,
        });
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.status(StatusCodes.NO_CONTENT).json({
            message: ReasonPhrases.NO_CONTENT,
        });
    }
});

module.exports = { register, logIn, logOut, refreshToken };
