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

    req.user = decodeUser;
    next();
});
module.exports = authentication;
