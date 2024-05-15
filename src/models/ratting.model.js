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
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ratting: {
            type: Number,
            required: true,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
        },
        comment: {
            type: String,
        },
        gallery: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, rattingSchema);
