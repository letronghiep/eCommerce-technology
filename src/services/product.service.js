"use strict";

const productModel = require("../models/product.model");

// const findAllProduct = async ({
//   limit = 50,
//   sort = "ctime",
//   page = 1,
//   filter = { isPublished: true },
// }) => {
//   const skip = (page - 1) * limit;
//   const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
//   return await productModel
//     .find(filter)
//     .populate("category", "name brand_id _id")
//     .sort(sortBy)
//     .skip(skip)
//     .limit(limit)
//     .lean()
//     .exec();
// };

async function findAllProduct({ limit, sort, page, filter, select }) {
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const skip = (page - 1) * limit;
  return await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
}
module.exports = { findAllProduct };
