'use strict';
const express = require('express');
const {
    createProduct,
    getAllProduct,
    searchProducts,
    publishedProductInDraft,
    unPublishedProduct,
    updateProduct,
    getProductBySlug,
    getProductById,
    deleteProductById,
} = require('../controllers/product.controller');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');
const { uploadImage } = require('../middlewares/uploadImage.middleware');

const router = express.Router();

router.get('/search', searchProducts);
router.get('/:slug', getProductBySlug);
router.get('/search', searchProducts);
router
    .route('/')
    .get(getAllProduct)
    .post(authentication, uploadImage, createProduct);

router
    .route('/:id')
    .get(getProductById)
    .patch(authentication, updateProduct)
    .delete(authentication, deleteProductById);

router.get('/:slug', getProductBySlug);

module.exports = router;
