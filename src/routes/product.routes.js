"use strict";
const express = require("express");
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
} = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication.middleware");

const router = express.Router();
router.get("/", getAllProduct);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.use(authentication);
router.post("/", createProduct);
router.get("/admin", getAllProductForAdmin);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProductById);
router.post("/published/:id", publishedProductInDraft);
router.post("/unPublished/:id", unPublishedProduct);

module.exports = router;
