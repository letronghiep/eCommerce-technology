'use strict';
const { Types } = require('mongoose');
const { StatusCodes } = require('http-status-codes');

const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { CREATED, OK } = require('../utils/success.response');
const { paginate, generateSku } = require('../configs/common');
const Category = require('../models/category.model');
const Color = require('../models/color.model');
const Brand = require('../models/brand.model');
const Product = require('../models/product.model');
const {
    updateNestedObjectParser,
    removeUndefinedObject,
} = require('../repositories/updateNested');
// Create product
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
    const colorObj = await Color.findById(new Types.ObjectId(color)).lean();
    const categoryObj = await Category.findById(
        new Types.ObjectId(category)
    ).lean();
    const brandObj = await Brand.findById(new Types.ObjectId(brand_id)).lean();
    const randomCode = Math.floor(Math.random() * 100 + 1).toString();
    const last_code = randomCode.length > 1 ? randomCode : '0' + randomCode;
    const SKU = await generateSku({
        brand: brandObj.brand_code,
        category: categoryObj.category_code,
        color: colorObj?.color_code,
        last_code: last_code,
    });
    const newProduct = new Product({
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
        message: 'Product created successfully',
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
        throw new ApiError(StatusCodes.NOT_FOUND, 'No such Product Found');
    const updatedProduct = await Product.findByIdAndUpdate(
        {
            _id: req.params.id,
            userId: req.user.id,
        },
        updateNestedObjectParser(removeUndefinedObject(req.body))
    );
    console.log('Updated::', updatedProduct);
    return new CREATED({
        message: 'Your Product has been updated successfully',
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
        select: ['name', 'brand_id', 'price'],
    });
    return new OK({
        message: 'Product list',
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
        model: Product,
        filter: { $text: { $search: textSearch }, isPublished: true },
        page: page,
        sort: { score: { $meta: 'textScore' } },
        limit: limit,
        select: ['name', 'brand_id', 'price', 'promotion'],
    });
    return new OK({
        message: 'Search Products',
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
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    foundProduct.isPublished = true;
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        foundProduct,
        {
            new: true,
        }
    );
    return await new OK({
        message: 'Product is published',
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
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product is not found');
    foundProduct.isPublished = false;
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        foundProduct,
        {
            new: true,
        }
    );
    return await new OK({
        message: 'Product is unPublished',
        metadata: updatedProduct,
    }).send(res);
});
// Get product By id
const getProductById = catchAsync(async (req, res, next) => {
    const foundProduct = await Product.findOne({
        _id: req.params.id,
    });
    if (!foundProduct)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product Not Found');
    return await new OK({
        message: 'Successfully got the data',
        metadata: await foundProduct,
    }).send(res);
});
/* Admin Dashboard */
// Display with adminDashboard
const getAllProductForAdmin = catchAsync(async (req, res, next) => {
    const queryParams = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const products = await paginate({
        model: Product,
        page: page,
        sort: queryParams.sortBy,
        limit: limit,
    });
    return new OK({
        message: 'Product list',
        metadata: await products,
    }).send(res);
});
// delete product
const deleteProductById = catchAsync(async (req, res, next) => {
    const foundProduct = await Product.findOne({
        _id: req.params.id,
    });
    if (!foundProduct)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    await Product.findByIdAndDelete(req.params.id);
    return new OK({
        message: 'Product is deleted',
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
    getAllProductForAdmin,
    deleteProductById,
};
