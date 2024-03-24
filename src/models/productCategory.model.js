'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'ProductCategories';
const DOCUMENT_NAME = 'ProductCategory';

const rattingSchema = new Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, rattingSchema);
