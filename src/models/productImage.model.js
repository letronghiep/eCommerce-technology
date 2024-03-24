'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'ProductImages';
const DOCUMENT_NAME = 'ProductImage';

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
        image_url: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, rattingSchema);
