'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Address';
const DOCUMENT_NAME = 'Address';

const addressSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        province: { type: String },
        district: { type: String },
        commune: { type: String },
        description: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, addressSchema);
