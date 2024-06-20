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
        products: {
            type: Array,
        },
        order_date: {
            type: Date,
            default: Date.now,
        },
        total_price: {
            type: Number,
        },
        shipping_costs: {
            type: Number,
            default: 0,
        },
        amount: {
            type: Number,
        },
        deposit: {
            type: Number,
            default: 0,
        },
        order_status: {
            type: String,
            default: 'order',
            enum: ['order', 'confirm', 'delivery', 'complete'],
        },
        shipping_id: {
            type: Schema.Types.ObjectId,
            ref: 'Shipping',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

orderSchema.pre('save', function (next) {
    this.amount = this.shipping_costs + this.total_price;
    next();
});

module.exports = model(DOCUMENT_NAME, orderSchema);
