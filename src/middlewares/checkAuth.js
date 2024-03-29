const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const verifyJWT = (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    if (!authHeaders)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Invalid authorization header'
        );

    const token = authHeaders.split(' ')[1];
    if (!token)
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            ReasonPhrases.UNAUTHORIZED
        );

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            throw new ApiError(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);

        req.user = decoded;
        next();
    });
};

module.exports = verifyJWT;
