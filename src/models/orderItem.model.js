'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'OrderItems';
const DOCUMENT_NAME = 'OrderItem';

const orderItemSchema = new Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
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
        quantity: { type: Number },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, orderItemSchema);
