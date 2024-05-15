"use strict";
const express = require("express");
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
} = require("../controllers/news.controller");
const authentication = require("../middlewares/authentication.middleware");
const { uploadAvatar } = require("../middlewares/uploadImage.middleware");

const router = express.Router();

router
  .route("/:id")
  .get(getNewsById)
  .put(authentication, uploadAvatar, updateNews)
  .delete(authentication, deleteNews);
router.route("/you").get(authentication, getAllNewsByUser);
router
  .route("/")
  .get(getAllNews)
  .post(authentication, uploadAvatar, createNews);
router
  .use(authentication)
  .route("/:newsId/comment")
  .post(createComment)
  .put(updateComment)
  .delete(deleteComment);
module.exports = router;
