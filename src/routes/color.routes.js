"use strict";
const express = require("express");
const { createColor } = require("../controllers/color.controller");

const router = express.Router();

router.post("/", createColor);

module.exports = router;
