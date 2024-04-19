'use strict';
const express = require('express');
const {
    createProduct,
    getAllProduct,
    searchProducts,
    publishedProductInDraft,
    unPublishedProduct,
    updateProduct,
    getAllProductForAdmin,
    getProductById,
    deleteProductById,
} = require('../controllers/product.controller');
const authentication = require('../middlewares/authentication.middleware');
const uploadImage = require('../middlewares/uploadImage.middleware');

const router = express.Router();

router.get('/search', searchProducts);
router
    .route('/')
    .get(getAllProduct)
    .post(authentication, uploadImage, createProduct);

router.use(authentication);
router
    .route('/:id')
    .get(getProductById)
    .patch(updateProduct)
    .delete(deleteProductById);
router.get('/admin', getAllProductForAdmin);
router.post('/published/:id', publishedProductInDraft);
router.post('/unPublished/:id', unPublishedProduct);


module.exports = router;
