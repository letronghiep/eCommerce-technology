'use strict';
const express = require('express');
const {
    createCategory,
    getAllCategories,
} = require('../controllers/category.controller');

const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const router = express.Router();

router.get('/', getAllCategories);
router.use(authentication, restrictTo('admin'));

router.post('/', createCategory);
module.exports = router;
