"use strict";
const colorModel = require("../models/color.model");
const catchAsync = require("../utils/catchAsync");
const { CREATED } = require("../utils/success.response");
const createColor = catchAsync(async (req, res, next) => {
  const { color_name } = req.body;
  const newColor = new colorModel({
    color_name,
  });
  // const createdCategory = ;
  return new CREATED({
    message: "Color created successfully",
    metadata: await colorModel.create(newColor)
  }).send(res)
});
module.exports = {
  createColor,
};
