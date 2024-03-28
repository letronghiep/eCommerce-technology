"use strict";

const { Schema, model, default: mongoose } = require("mongoose");
const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "Product";
const slugify = require("slugify");

const productSchema = new Schema(
  {
    name: {
      type: String,
      min: [5, "Username must be more than 6 characters"],
      required: [true, "Please enter brand name"],
    },
    slug: String,
    brand_id: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please enter price product"],
    },
    quantity_import: {
      type: Number,
      default: 0,
    },
    quantity_sold: {
      type: Number,
      default: 0,
    },
    promotion: {
      type: Number,
      Default: 0,
    },
    image_url: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    attribute: {
      type: Schema.Types.Mixed,
      required: true,
    },
    slug: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sku: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
productSchema.index({ name: "text", description: "text" });
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  // this.sku = 
  next();
});
module.exports = model(DOCUMENT_NAME, productSchema);
