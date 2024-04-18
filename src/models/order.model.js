'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Order';

const orderSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order_date: {
            type: Date,
            default: Date.now,
        },
        shipping_costs: {
            type: Number,
        },
        phone_number: {
            type: String,
            required: [true, 'Please enter a valid phone number'],
        },
        description: {
            type: String,
        },
        order_status: {
            type: String,
            default: 'order',
            enum: ['order', 'confirm', 'delivery', 'complete'],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
