'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'ProductColors';
const DOCUMENT_NAME = 'ProductColors';

const rattingSchema = new Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        colors_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Color',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, rattingSchema);
