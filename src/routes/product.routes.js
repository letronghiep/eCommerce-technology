"use strict";
const express = require("express");
const {
  createProduct,
  getAllProduct,
  searchProducts,
  publishedProductInDraft,
  unPublishedProduct,
  updateProduct,
  getProductById,
  deleteProductById,
  getProductBySlug
} = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication.middleware");

const router = express.Router();
router.get("/", getAllProduct);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.get("/:slug", getProductBySlug);
router.use(authentication);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProductById);
router.post("/published/:id", publishedProductInDraft);
router.post("/unPublished/:id", unPublishedProduct);

module.exports = router;
