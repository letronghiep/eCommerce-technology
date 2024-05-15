"use strict";
const express = require("express");
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
  filterProducts,
} = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication.middleware");
const { uploadImage } = require("../middlewares/uploadImage.middleware");

const router = express.Router();

router.get("/search", searchProducts);
router.get("/collections", filterProducts);
router.get("/:slug", getProductBySlug);
router
  .route("/")
  .get(getAllProduct)
  .post(authentication, uploadImage, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .patch(authentication, updateProduct)
  .delete(authentication, deleteProductById);

router.get("/:slug", getProductBySlug);

module.exports = router;
