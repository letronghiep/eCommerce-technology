"use strict";
const express = require("express");
const {
  getAllAddressShipping,
  createAddressShipping,
  updateAddressShipping,
  deleteAddressShipping,
  getShippingById,
} = require("../controllers/shipping.controller");
const { authentication } = require("../middlewares/authentication.middleware");

const router = express.Router();

router.use(authentication);
router
  .route("/:id")
  .get(getShippingById)
  .put(updateAddressShipping)
  .delete(deleteAddressShipping);
router.route("/").get(getAllAddressShipping).post(createAddressShipping);

module.exports = router;
