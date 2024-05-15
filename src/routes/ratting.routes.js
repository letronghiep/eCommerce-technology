'use strict';
const express = require('express');
const {
    getAllRattings,
    getRatting,
    createRatting,
    updateRatting,
    deleteRatting,
} = require('../controllers/ratting.controller');
const { uploadGallery } = require('../middlewares/uploadImage.middleware');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const router = express.Router();
router
    .route('/:id')
    .get(getRatting)
    .patch(authentication, restrictTo('user', 'shop', 'admin'), updateRatting)
    .delete(authentication, restrictTo('user', 'shop', 'admin'), deleteRatting);

router
    .route('/')
    .get(getAllRattings)
    .post(authentication, restrictTo('user'), uploadGallery, createRatting);

module.exports = router;
