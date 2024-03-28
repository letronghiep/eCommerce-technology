'use strict';

const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'ProductColor';
const COLLECTION_NAME = 'ProductColors';

const productColorSchema = new Schema(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        colors_id: {
            type: Schema.Types.ObjectId,
            ref: 'Color',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, productColorSchema);
