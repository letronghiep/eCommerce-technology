const productModel = require("../models/product.model");

async function getProductBySearch({ keySearch }) {
  try {
    const searchRex = new RegExp(keySearch);
    console.log("Search regex::->", searchRex);
    const result = await productModel
      .find(
        {
          // $or: [
          //   { $text: { $search: searchRex } },
          //   { specs: { $in: searchRex } },
          // ],
          // $text: { $search: searchRex },
          $or: [
            { name: { $regex: searchRex } }, // Sử dụng chỉ mục 'name'
            { description: { $regex: searchRex } }, // Sử dụng chỉ mục 'description'
            { "specs.k": { $regex: searchRex } }, // Sử dụng chỉ mục 'specs.k'
            { "specs.v": { $regex: searchRex } }, // Sử dụng chỉ mục 'specs.v'
            { "specs.u": { $regex: searchRex } }, // Sử dụng chỉ mục 'specs.v'
          ],
          isPublished: true,
        },
        // { score: { $meta: "textScore" } }
      )
      .sort()
      .lean();
    console.log("Productss::", result);
    return result;
  } catch (error) {
    console.log("Error in getProductBySearch::", error.message);
  }
}
module.exports = getProductBySearch;
