'use strict';
const { CREATED } = require('../utils/success.response');

const Brand = require('../models/brand.model');
const catchAsync = require('../utils/catchAsync');
const createBrand = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const newBrand = new Brand({
        name,
    });
    return new CREATED({
        message: `Created a new Brand with ID`,
        metadata: await Brand.create(newBrand),
    }).send(res);
});
module.exports = {
    createBrand,
};
