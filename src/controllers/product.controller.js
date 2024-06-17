"use strict";
const { Types } = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { CREATED, OK } = require("../utils/success.response");
const { paginate, generateSku } = require("../configs/common");
const Category = require("../models/category.model");
const Color = require("../models/color.model");
const Brand = require("../models/brand.model");
const Product = require("../models/product.model");
const {
  updateNestedObjectParser,
  removeUndefinedObject,
} = require("../repositories/updateNested");
// Create product
const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    brand_id,
    category_id,
    color_id,
    description,
    price,
    quantity_import,
    quantity_sold,
    promotion,
    specs,
  } = req.body;
  const colorObj = await Color.findById(new Types.ObjectId(color_id)).lean();
  const categoryObj = await Category.findById(
    new Types.ObjectId(category_id)
  ).lean();
  const brandObj = await Brand.findById(new Types.ObjectId(brand_id)).lean();
  const randomCode = Math.floor(Math.random() * 100 + 1).toString();
  const last_code = randomCode.length > 1 ? randomCode : "0" + randomCode;
  const SKU = await generateSku({
    brand: brandObj.brand_code,
    category: categoryObj.category_code,
    color: colorObj?.color_code,
    last_code: last_code,
  });

  const user_id = req.user.id;
  const avatar = req.urlFile.avatar;
  const gallery = req.urlFile.gallery;
  const newProduct = new Product({
    name,
    brand_id,
    user_id,
    category_id,
    color_id,
    description,
    price,
    quantity_import,
    quantity_sold,
    promotion,
    avatar,
    gallery,
    specs,
  });
  newProduct.sku = SKU.toString();
  return new CREATED({
    message: "Product created successfully",
    metadata: await Product.create(newProduct),
  }).send(res);
});

// Update product by Id
const updateProduct = catchAsync(async (req, res, next) => {
  const foundShop = await Product.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!foundShop)
    throw new ApiError(StatusCodes.NOT_FOUND, "No such Product Found");
  const updatedProduct = await Product.findByIdAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id,
    },
    updateNestedObjectParser(removeUndefinedObject(req.body))
  );
  console.log("Updated::", updatedProduct);
  return new CREATED({
    message: "Your Product has been updated successfully",
    metadata: await updatedProduct,
  }).send(res);
});

// Display with homePage
const getAllProduct = catchAsync(async (req, res, next) => {
  const queryParams = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const products = await paginate({
    model: Product,
    filter: { isPublished: true },
    page: page,
    sort: queryParams.sortBy,
    limit: limit,
    populate: [{ path: "brand_id" }, { path: "category_id" }],
  });
  console.log(products)
  return new OK({
    message: "Product list",
    metadata: await products,
  }).send(res);
});
// search Product
const searchProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const queryString = req.query;
  // const keySearch = req.query.keySearch;

  // console.log("Req params::", keySearch);
  const keywords = req.query.q?.split(" ");
  const regexQueries = keywords?.map((keyword) => new RegExp(keyword, "i"));
  const filter = {
    // using regexQuery
    $and: regexQueries.map((regexQuery) => ({
      $or: [
        { name: { $regex: regexQuery } }, // Tìm kiếm trong tên sản phẩm
        { description: { $regex: regexQuery } }, // Tìm kiếm trong mô tả sản phẩm
        { "specs.k": { $regex: regexQuery } }, // Tìm kiếm trong thuộc tính k của specs
        { "specs.v": { $regex: regexQuery } }, // Tìm kiếm trong thuộc tính v của specs
        { "specs.u": { $regex: regexQuery } }, // Tìm kiếm trong thuộc tính u của specs
      ],
    })),
    isPublished: true,
  };
  const products = await paginate({
    model: Product,
    filter: filter,
    page: page,
    sort: queryString.sortBy,
    limit: limit,
    populate: [{ path: "brand_id" }, { path: "category_id" }],
  });
  return new OK({
    message: "Search Products",
    metadata: await products,
  }).send(res);
});
// Filter products
const filterProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const queryString = req.query;
  const orConditions = [];
  Object.keys(queryString).map((item) => {
    console.log(typeof queryString[item]);
    if (typeof queryString[item] !== "string") {
      return orConditions.push({
        "specs.k": item,
        "specs.v": { $in: queryString[item].split(".") },
      });
    } else {
      return orConditions.push({
        "specs.k": item,
        "specs.v": queryString[item].split("."),
      });
    }
  });
  const mongoQuery = { $or: orConditions, isPublished: true };
  const products = await paginate({
    model: Product,
    filter: mongoQuery,
    page: page,
    sort: queryString.sortBy,
    limit: limit,
    populate: [{ path: "brand_id" }, { path: "category_id" }],
  });
  return new OK({
    message: "Filter Products",
    metadata: await products,
  }).send(res);
});
// Public Product In Draft
const publishedProductInDraft = catchAsync(async (req, res, next) => {
  const foundProduct = await Product.findOne({
    _id: req.params.id,
    userId: new Types.ObjectId(req.user.id),
    isPublished: false,
  });
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  foundProduct.isPublished = true;
  const updatedProduct = await Product.findByIdAndUpdate(
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
  const foundProduct = await Product.findOne({
    _id: req.params.id,
    userId: new Types.ObjectId(req.user.id),
    isPublished: true,
  });
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product is not found");
  foundProduct.isPublished = false;
  const updatedProduct = await Product.findByIdAndUpdate(
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
// Get product By id
const getProductById = catchAsync(async (req, res, next) => {
  const foundProduct = await Product.findOne({
    _id: req.params.id,
  });
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found");
  return await new OK({
    message: "Successfully got the data",
    metadata: await foundProduct,
  }).send(res);
});
// Get product By slug
const getProductBySlug = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const foundProduct = await Product.findOne({
    slug: req.params.slug,
  })
    .populate("brand_id")
    .populate("category_id");
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product Not Found");
  return await new OK({
    message: "Successfully got the data",
    metadata: await foundProduct,
  }).send(res);
});
// delete product
const deleteProductById = catchAsync(async (req, res, next) => {
  const foundProduct = await Product.findOne({
    _id: req.params.id,
  });
  if (!foundProduct)
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");

  await Product.findByIdAndDelete(req.params.id);
  return new OK({
    message: "Product is deleted",
  }).send(res);
});
module.exports = {
  createProduct,
  updateProduct,
  getAllProduct,
  searchProducts,
  publishedProductInDraft,
  unPublishedProduct,
  getProductById,
  deleteProductById,
  getProductBySlug,
  filterProducts,
};
