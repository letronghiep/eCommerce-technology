"use strict";
const categoryModel = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const { CREATED } = require("../utils/success.response");
const createCategory = catchAsync(async (req, res, next) => {
  const { category_name, parentCategory } = req.body;
  const newCategory = new categoryModel({
    category_name,
    parentCategory,
  });
  // const createdCategory = ;
  throw new CREATED({
    message: "Category created successfully",
    metadata: await categoryModel.create(newCategory)
  }).send(res)
});
module.exports = {
  createCategory,
};
