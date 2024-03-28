"use strict";
const express = require("express");
const { createProduct, getAllProduct } = require("../controllers/product.controller");

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProduct);

module.exports = router;
