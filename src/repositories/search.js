const productModel = require("../models/product.model");
const getSortCondition = function ($value) {
  switch ($value) {
      case 'ctime':
          return { _id: -1 };
      default:
          return { _id: 1 };
  }
};
async function getProductBySearch(keySearch, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const sortBy = getSortCondition(query.sort)
    const keywords = keySearch?.split(" ");
    const regexQueries = keywords?.map((keyword) => new RegExp(keyword, "i"));
    // const searchRex = new RegExp(keySearch);
    console.log("Search regex::->", regexQueries);
    console.log("Key search", keySearch);
    const result = await productModel
      .find(
        {
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
        }
        // { score: { $meta: "textScore" } }
      )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    console.log("Productss::", result);
    return result;
  } catch (error) {
    console.log("Error in getProductBySearch::", error.message);
  }
}
async function getProductByFilters(queryString) {
  try {
    console.log("Query String::", queryString);
    // const searchObj = {};
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
    const totalRow = await productModel.countDocuments(mongoQuery);
    const result = await productModel.find(mongoQuery).sort().lean();
    return { result, totalRow };
  } catch (error) {
    console.log("Có lỗi xảy ra trong quá trình tìm kiếm", error);
  }
}
module.exports = { getProductBySearch, getProductByFilters };
