'use strict';
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const { OK } = require('../utils/success.response');

const getDateParts = (date) => {
    const day = parseInt(date.getDate());
    const month = parseInt(date.getMonth()) + 1;
    const year = parseInt(date.getFullYear());
    return { day, month, year };
};

const getDataDashboard = catchAsync(async (req, res) => {
    const dateNow = new Date();
    const { day, month, year } = getDateParts(dateNow);

    const revenueByYear = await Order.getRevenue(year);
    const revenueByMonth = await Order.getRevenue(year, month);
    const revenueByDay = await Order.getRevenue(year, month, day);

    const totalUser = await User.where({ status: 'pending' }).countDocuments();
    const totalProduct = await Product.where({
        isPublished: true,
    }).countDocuments();

    return new OK({
        message: 'Information dashboard',
        metadata: {
            revenueByYear,
            revenueByMonth,
            revenueByDay,
            totalUser,
            totalProduct,
        },
    }).send(res);
});

module.exports = { getDataDashboard };
