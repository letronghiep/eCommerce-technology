'use strict';
const express = require('express');
const {
    getAllNews,
    getAllNewsByUser,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
} = require('../controllers/news.controller');
const authentication = require('../middlewares/authentication.middleware');
const { uploadAvatar } = require('../middlewares/uploadImage.middleware');

const router = express.Router();

router.use(authentication);
router
    .route('/:id')
    .get(getNewsById)
    .put(uploadAvatar, updateNews)
    .delete(deleteNews);
router.route('/you').get(getAllNewsByUser);
router.route('/').get(getAllNews).post(uploadAvatar, createNews);
module.exports = router;
