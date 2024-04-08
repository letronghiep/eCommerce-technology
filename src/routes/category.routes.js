"use strict";
const express = require("express");
const {
  createCategory,
  getAllCategories
} = require("../controllers/category.controller");

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
module.exports = router;
