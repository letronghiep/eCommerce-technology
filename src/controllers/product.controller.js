"use strict";
const { paginate } = require("../configs/common");
const productModel = require("../models/product.model");
const { findAllProduct } = require("../services/product.service");
const { getSelectData } = require("../utils");
const catchAsync = require("../utils/catchAsync");
const { CREATED, SuccessResponse, OK } = require("../utils/success.response");
const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    brand_id,
    userId,
    category,
    description,
    price,
    quantity_import,
    promotion,
    image_url,
    attribute,
  } = req.body;
  const newProduct = new productModel({
    name,
    brand_id,
    userId,
    category,
    description,
    price,
    quantity_import,
    promotion,
    image_url,
    attribute,
  });
  throw new CREATED({
    message: "Product created successfully",
    metadata: await productModel.create(newProduct),
  }).send(res);
});
async function getProducts({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter = { isPublished: true },
}) {
  return await findAllProduct({
    limit: limit,
    sort,
    page,
    filter,
    select: ["name", "price", "brand_id"],
  });
}
// Display with homePage
const getAllProduct = catchAsync(async (req, res, next) => {
  const queryParams = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const products = await paginate(
    productModel,
    {
      filter: { isPublished: true },
      select: ["name", "price", "brand_id"],
    },
    limit,
    page
  );
  console.log("products::", products);
  //
  return res.status(200).json(products);
});
module.exports = {
  createProduct,
  getAllProduct,
};
