'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Categories';
const DOCUMENT_NAME = 'Category';

const categorySchema = new Schema(
    {
        category_name: { type: String, required: true },
        parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
        slug: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, categorySchema);
