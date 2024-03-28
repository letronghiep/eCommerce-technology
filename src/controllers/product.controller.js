"use strict";
const { paginate, generateSku } = require("../configs/common");
const categoryModel = require("../models/category.model");
const colorModel = require("../models/color.model");
const brandModel = require("../models/brand.model");
const productModel = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");
const { CREATED, SuccessResponse, OK } = require("../utils/success.response");
const { Types } = require("mongoose");

const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    brand_id,
    userId,
    category,
    color,
    description,
    price,
    quantity_import,
    promotion,
    image_url,
    attribute,
  } = req.body;
  const colorObj = await colorModel.findById(new Types.ObjectId(color)).lean();
  const categoryObj = await categoryModel
    .findById(new Types.ObjectId(category))
    .lean();
  const brandObj = await brandModel
    .findById(new Types.ObjectId(brand_id))
    .lean();
  const randomCode = Math.floor(Math.random() * 100 + 1).toString();
  const last_code = randomCode.length > 1 ? randomCode : "0" + randomCode;
  const SKU = await generateSku({
    brand: brandObj.brand_code,
    category: categoryObj.category_code,
    color: colorObj?.color_code,
    last_code: last_code,
  });
  const newProduct = new productModel({
    name,
    brand_id,
    userId,
    category,
    color,
    description,
    price,
    quantity_import,
    promotion,
    image_url,
    attribute,
  });
  newProduct.sku = SKU.toString();
  return new CREATED({
    message: "Product created successfully",
    metadata: await productModel.create(newProduct),
  }).send(res);
});

// Display with homePage
const getAllProduct = catchAsync(async (req, res, next) => {
  const queryParams = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const products = await paginate({
    model: productModel,
    filter: { isPublished: true },
    page: page,
    sort: queryParams.sortBy,
    limit: limit,
    select: ["name", "brand_id", "price"],
  });
  return new OK({
    message: "Product list",
    metadata: await products,
  }).send(res);
});

// search Product
const searchProducts = catchAsync(async (req, res, next) => {
  const queryParams = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const products = await paginate({
    model: productModel,
    filter: { isPublished: true },
    page: page,
    sort: queryParams.sortBy,
    limit: limit,
    select: ["name", "brand_id", "price"],
  });
  return new OK({
    message: "Product list",
    metadata: await products,
  }).send(res);
});

module.exports = {
  createProduct,
  getAllProduct,
};
//con cac , sua cl , dm , vcl alsdkjfhalskdjfhasudifasdkjf
// dua nao xoa dong nay la con cko
// hiep ngu
