'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Shipping';
const DOCUMENT_NAME = 'Shipping';

const shippingSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipient_name: {
            type: String,
        },
        phone_number: {
            type: String,
            required: [true, 'Please enter a valid phone number'],
        },
        address: {
            type: String,
            required: [true, 'Please enter a valid address'],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, shippingSchema);
