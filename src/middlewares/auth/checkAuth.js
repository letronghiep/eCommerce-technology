"use strict";
const ApiError = require("../../utils/ApiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { HEADER } = require("../../constants");
const { findById } = require("../../services/apikey.service");
const catchAsync = require("../../utils/catchAsync");

const apiKey = catchAsync(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    throw new ApiError(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  const objKey = await findById(key);
  if (!objKey) {
    throw new ApiError(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  req.objKey = objKey;
});
const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN,
        "Permission denied"
      );
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        ReasonPhrases.FORBIDDEN,
        "Permission not found"
      );
    }
    return next();
  };
};
module.exports = {
  apiKey,
  permission,
};
