"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const { generateCode } = require("../configs/common");
const COLLECTION_NAME = "Brands";
const DOCUMENT_NAME = "Brand";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter brand name"],
    },
    slug: {
      type: String,
      unique: true,
    },
    brand_code: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.brand_code = generateCode(this.name);
  next();
});

module.exports = model(DOCUMENT_NAME, brandSchema);
