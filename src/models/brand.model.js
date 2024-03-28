"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const COLLECTION_NAME = "Brands";
const DOCUMENT_NAME = "Brand";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter brand name"],
    },
    slug: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = model(DOCUMENT_NAME, brandSchema);
