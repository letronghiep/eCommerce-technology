"use strict";
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const News = require("../models/news.model");
const { OK, CREATED } = require("../utils/success.response");
const { paginate } = require("../configs/common");

const getAllNews = catchAsync(async (req, res, next) => {
  const news = await News.find({ status: "active" })
    .sort({ createAt: -1 })
    .populate("user_id");
  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  return new OK({
    message: ReasonPhrases.OK,
    metadata: news,
  }).send(res);
});

// Search News
const getNewsByPaginate = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = {
    status: "active",
  };
  const news = await paginate({
    model: News,
    filter: filter,
    page: page,
    sort: req.query.sortBy,
    limit: limit,
    populate: {
      path: "user",
      select: "_id full_name username",
    },
  });
  if (!news) {
    throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  }
  return new OK({
    message: "List News",
    metadata: news,
  }).send(res);
});

const getNewsById = catchAsync(async (req, res, next) => {
  const news = await News.findOne({ _id: req.params.id });

  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  return new OK({
    message: ReasonPhrases.OK,
    metadata: news,
  }).send(res);
});
const getNewsBySlug = catchAsync(async (req, res, next) => {
  const news = await News.findOne({ slug: req.params.slug })
    .populate({ path: "user_id", select: "_id full_name username" })
    .lean();

  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  return new OK({
    message: ReasonPhrases.OK,
    metadata: news,
  }).send(res);
});

// Search News by tags
const getNewsByTags = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchTags = req.query.tags.split(".");
  console.log(searchTags);
  const filter = {
    tags: { $in: searchTags },
  };
  const news = await paginate({
    model: News,
    filter: filter,
    page: page,
    sort: req.query.sortBy,
    limit: limit,
    populate: {
      path: "user_id",
      select: "_id full_name username",
    },
  });
  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  return new OK({
    message: ReasonPhrases.OK,
    metadata: news,
  }).send(res);
});

const getAllNewsByUser = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = {
    user_id: req.user.id,
  };
  const news = await paginate({
    model: News,
    filter: filter,
    page: page,
    sort: req.sortBy,
    limit: limit,
  });

  if (!news) {
    throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  }
  return new OK({
    message: "List News By User",
    metadata: news,
  }).send(res);
});

const createNews = catchAsync(async (req, res, next) => {
  const { title, topic, content, tags } = req.body;
  const user_id = req.user.id;
  const avatar = req.urlFile.avatar;

  const createNews = await News.create({
    user_id,
    title,
    topic,
    content,
    avatar,
    tags,
  });

  if (!createNews)
    throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

  return new CREATED({
    message: ReasonPhrases.CREATED,
    metadata: createNews,
  }).send(res);
});

const updateNews = catchAsync(async (req, res, next) => {
  const updateNews = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return new OK({
    message: ReasonPhrases.OK,
    metadata: updateNews,
  }).send(res);
});
// Block news
const blockNews = catchAsync(async (req, res, next) => {
  await News.findByIdAndUpdate(req.params.id, {
    status: "block",
  });

  res.status(StatusCodes.NO_CONTENT).json({
    message: ReasonPhrases.NO_CONTENT,
    metadata: null,
  });
});
// delete News
const deleteNews = catchAsync(async (req, res, next) => {
  await News.findByIdAndDelete(req.params.id);
  return new OK({
    message: ReasonPhrases.OK,
    metadata: null,
  }).send(res);
});
const createComment = catchAsync(async (req, res, next) => {
  let news = await News.findOne({ _id: req.params.newsId });

  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  const commentator = req.user.id;
  const content = req.body.content;

  news.comment.push({
    commentator,
    content,
  });
  news.save();

  return new OK({
    message: "Comment successfully",
    metadata: news,
  }).send(res);
});

const updateComment = catchAsync(async (req, res, next) => {
  let news = await News.findOne({ _id: req.params.newsId });

  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  const { comment_id, content } = req.body;
  const commentIndex = news.comment.findIndex(
    (comment) => comment._id.toString() === comment_id
  );

  if (commentIndex === -1)
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");

  news.comment[commentIndex].content = content;
  news.save();

  return new OK({
    message: "Update comment successfully",
    metadata: news,
  }).send(res);
});

const deleteComment = catchAsync(async (req, res, next) => {
  let news = await News.findOne({ _id: req.params.newsId });

  if (!news) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  const { comment_id } = req.body;
  const commentIndex = news.comment.findIndex(
    (comment) => comment._id.toString() === comment_id
  );

  if (commentIndex === -1)
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");

  news.comment.splice(commentIndex, 1);
  news.save();

  return new OK({
    message: "Delete comment successfully",
    metadata: news,
  }).send(res);
});

module.exports = {
  getAllNews,
  getNewsById,
  getNewsBySlug,
  getAllNewsByUser,
  getNewsByTags,
  getNewsByPaginate,
  createNews,
  updateNews,
  blockNews,
  deleteNews,
  createComment,
  updateComment,
  deleteComment,
};
