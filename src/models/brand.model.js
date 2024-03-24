'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Brands';
const DOCUMENT_NAME = 'Brand';

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter brand name'],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, brandSchema);
