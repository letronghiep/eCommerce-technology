"use strict";
const express = require("express");
const {
  createProduct,
  getAllProduct,
  searchProducts,
  publishedProductInDraft,
  unPublishedProduct,
} = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication.middleware");

const router = express.Router();
router.get("/", getAllProduct);
router.get("/search", searchProducts);
router.use(authentication);
router.post("/", createProduct);
router.post("/published/:id", publishedProductInDraft);
router.post("/unPublished/:id", unPublishedProduct);

module.exports = router;
