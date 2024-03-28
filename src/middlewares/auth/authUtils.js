"use strict";
const JWT = require("jsonwebtoken");
const { findTokenByUserId } = require("../../services/keyToken.service");
const  catchAsync = require("../../utils/catchAsync")
const { HEADER } = require("../../constants/index");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7days",
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(`Error in signing token::${error.message}`);
  }
};
const authentication = catchAsync(async(req, res, next) => {
    // const userId = req.headers[HEADER.]
})