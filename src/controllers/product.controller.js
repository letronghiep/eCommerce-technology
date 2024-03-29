"use strict";
const { paginate, generateSku } = require("../configs/common");
const categoryModel = require("../models/category.model");
const colorModel = require("../models/color.model");
const brandModel = require("../models/brand.model");
const productModel = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");
const { CREATED, OK } = require("../utils/success.response");
const { Types } = require("mongoose");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
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
// Update product by Id
const updateProduct = catchAsync(async (req, res, next) => {
  const foundShop = await productModel.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if(!foundShop) throw new ApiError(StatusCodes.NOT_FOUND, 'No such Product Found');
  
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
  const textSearch = new RegExp(queryParams.q);
  const products = await paginate({
    model: productModel,
    filter: { $text: { $search: textSearch }, isPublished: true },
    page: page,
    sort: { score: { $meta: "textScore" } },
    limit: limit,
    select: ["name", "brand_id", "price", "promotion"],
  });
  return new OK({
    message: "Search Products",
    metadata: await products,
  }).send(res);
});
// Public Product In Draft
const publishedProductInDraft = catchAsync(async (req, res, next) => {
  const foundProduct = await productModel.findOne({
    _id: req.params.id,
    userId: new Types.ObjectId(req.user.id),
    isPublished: false,
  });
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  foundProduct.isPublished = true;
  const updatedProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    foundProduct,
    {
      new: true,
    }
  );
  return await new OK({
    message: "Product is published",
    metadata: updatedProduct,
  }).send(res);
});
// Un published Product
const unPublishedProduct = catchAsync(async (req, res, next) => {
  const foundProduct = await productModel.findOne({
    _id: req.params.id,
    userId: new Types.ObjectId(req.user.id),
    isPublished: true,
  });
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product is not found");
  foundProduct.isPublished = false;
  const updatedProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    foundProduct,
    {
      new: true,
    }
  );
  return await new OK({
    message: "Product is unPublished",
    metadata: updatedProduct,
  }).send(res);
});
module.exports = {
  createProduct,
  getAllProduct,
  searchProducts,
  publishedProductInDraft,
  unPublishedProduct,
};
