'use strict';
const express = require('express');
const {
    getAllNews,
    getAllNewsByUser,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    createComment,
    updateComment,
    deleteComment,
} = require('../controllers/news.controller');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');
const { uploadAvatar } = require('../middlewares/uploadImage.middleware');

const router = express.Router();

router.route('/you').get(authentication, getAllNewsByUser);
router
    .route('/:id')
    .get(getNewsById)
    .put(authentication, uploadAvatar, updateNews)
    .delete(authentication, deleteNews);

router
    .route('/:newsId/comment')
    .post(authentication, createComment)
    .put(authentication, updateComment)
    .delete(authentication, deleteComment);

router
    .route('/')
    .get(getAllNews)
    .post(
        authentication,
        restrictTo('shop', 'admin'),
        uploadAvatar,
        createNews
    );
module.exports = router;