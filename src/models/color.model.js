"use strict";

const { Schema, model } = require("mongoose");
const { generateCode } = require("../configs/common");
const slugify = require("slugify");
const COLLECTION_NAME = "Colors";
const DOCUMENT_NAME = "Color";

const colorSchema = new Schema(
  {
    color_name: { type: String, required: true },
    slug: { type: String, unique: true },
    color_code: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
colorSchema.pre("save", function (next) {
  this.slug = slugify(this.color_name, {
    lower: true,
  });
  this.color_code = generateCode(this.color_name);
  next();
});
module.exports = model(DOCUMENT_NAME, colorSchema);
