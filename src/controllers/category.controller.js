"use strict";
const categoryModel = require("../models/category.model");
const catchAsync = require("../utils/catchAsync");
const { CREATED, OK } = require("../utils/success.response");
const createCategory = catchAsync(async (req, res, next) => {
  const { category_name, parentCategory } = req.body;
  const newCategory = new categoryModel({
    category_name,
    parentCategory,
  });
  // const createdCategory = ;
  return new CREATED({
    message: "Category created successfully",
    metadata: await categoryModel.create(newCategory),
  }).send(res);
});
const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await categoryModel.find().lean();
  console.log("categories::", categories);
  return new OK({
    message: "Category list",
    metadata: await categories,
  }).send(res);
});

module.exports = {
  createCategory,
  getAllCategories,
};
// Create category
