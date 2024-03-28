"use strict";

const { getSelectData } = require("../utils");

/**
 * @params {Number} page
 * @params {Number} perpage
 * @params {Number} limit
 */
// Paginate
const paginate = async (
  model,
  filter = {},
  query = {},
  page = 1,
  limit = 10,
  select = []
) => {
  const skip = (page - 1) * limit;
  try {
    const sortBy = getSortCondition(query.sort);
    const totalRow = await model.countDocument(filter);
    const totalPages = Math.ceil(totalRow / limit);
    const data = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .exec();
    return {
      limit,
      currentPage: page,
      totalRow,
      totalPages,
      data: data,
    };
  } catch (error) {
    console.log("Error in paginate");
  }
};
const getSortCondition = function ($value) {
  switch ($value) {
    case "ctime":
      return { _id: -1 };
    default:
      return { _id: 1 };
  }
};
module.exports = {
  paginate,
};
