"use strict";
const express = require("express");
const {
  createCategory,
  getCategoryChild,
  getParentCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.post("/", createCategory);
router.get("/parent", getParentCategory);
router.get("/child", getCategoryChild);
module.exports = router;
