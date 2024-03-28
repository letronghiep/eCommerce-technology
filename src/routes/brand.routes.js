"use strict";
const express = require("express");
const { createBrand } = require("../controllers/brand.controller");

const router = express.Router();

router.post("/", createBrand);

module.exports = router;
