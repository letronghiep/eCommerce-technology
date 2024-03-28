'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Rattings';
const DOCUMENT_NAME = 'Ratting';

const rattingSchema = new Schema(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: { type: Double, required: true },
        comment: { type: String },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, rattingSchema);
