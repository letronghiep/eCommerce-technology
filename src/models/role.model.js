"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Roles";
const DOCUMENT_NAME = "Role";
// Declare the Schema of the Mongo model
var roleSchema = new Schema(
  {
    name: {
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    slug: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    description: String,
    grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: {
          type: String,
          default: "*",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);
