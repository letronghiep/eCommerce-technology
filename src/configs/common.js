'use strict';

const { getSelectData } = require('../utils');
const getSortCondition = function ($value) {
    switch ($value) {
        case 'ctime':
            return { _id: -1 };
        default:
            return { _id: 1 };
    }
};
/**
 * @params {Number} page
 * @params {Number} perpage
 * @params {Number} limit
 */
// Paginate
const paginate = async ({
    model,
    filter = {},
    query = {},
    page = 1,
    limit = 10,
    select = [],
    populate = {}
}) => {
    const skip = (page - 1) * limit;
    try {
        const sortBy = getSortCondition(query.sort);
        const totalRow = await model.countDocuments(filter);
        const totalPages = Math.ceil(totalRow / limit);
        const data = await model
            .find(filter || query)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .populate(populate)
            .exec();
        return {
            limit,
            currentPage: page,
            totalRow,
            totalPages,
            data: data,
        };
    } catch (error) {
        console.log('Error in paginate::', error.message);
    }
};
// Generate code
const generateCode = (str) => {
    const name = str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    if (name === null || name === '')
        return Math.floor(Math.random() * 100 + 1);
    const arr = name.split(' ');
    if (arr.length >= 2) {
        return (
            arr[0].substring(0, 1).toUpperCase() +
            arr[1].substring(0, 1).toUpperCase()
        );
    }
    return name.substring(0, 2).toUpperCase();
};
// JD
// SKU = category-brand-color-random2so
const generateSku = ({ category, brand, last_code, color }) => {
    return `${brand}${category}${color}${last_code}`;
};
module.exports = {
    paginate,
    generateCode,
    generateSku,
};
