'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Colors';
const DOCUMENT_NAME = 'Color';

const colorSchema = new Schema(
    {
        colors_name: { type: String, required: true },
        slug: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, colorSchema);
