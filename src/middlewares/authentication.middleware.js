'use strict';
const jwt = require('jsonwebtoken');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const authentication = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Invalid authorization header ...'
        );

    const token = authHeader.split(' ')[1];
    if (!token)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED
        );

    const decodeUser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodeUser)
        throw new ApiError(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);

    console.log(decodeUser);
    req.user = decodeUser;
    next();
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'You do not have permission to perform this action.'
                )
            );

        next();
    };
};

module.exports = { authentication, restrictTo };
