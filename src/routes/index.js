"use strict";
const express = require("express");
const router = express.Router();

router.use("/v1/api/category", require("./category.routes"));
router.use("/v1/api/brand", require("./brand.routes"));
router.use("/v1/api/product", require("./product.routes"));
router.use("/v1/api/color", require("./color.routes"));

module.exports = router;
