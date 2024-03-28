"use strict";
const { CREATED } = require("../utils/success.response");

const brandModel = require("../models/brand.model");
const catchAsync = require("../utils/catchAsync");
const createBrand = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const newBrand = new brandModel({
    name,
  });
  throw new CREATED({
    message: `Created a new Brand with ID`,
    metadata: await brandModel.create(newBrand),
  }).send(res);
});
module.exports = {
  createBrand,
};
