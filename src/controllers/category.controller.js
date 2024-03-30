'use strict';
const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');
const { CREATED } = require('../utils/success.response');

const createCategory = catchAsync(async (req, res, next) => {
    const { category_name, parentCategory } = req.body;
    const newCategory = new Category({
        category_name,
        parentCategory,
    });
    // const createdCategory = ;
    return new CREATED({
        message: 'Category created successfully',
        metadata: await Category.create(newCategory),
    }).send(res);
});

module.exports = {
    createCategory,
};
// Create category
