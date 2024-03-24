'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'ShoppingCartProduct';
const DOCUMENT_NAME = 'ShoppingCartProduct';

const shoppingCartProductSchema = new Schema(
    {
        shopping_cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShoppingCart',
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

module.exports = model(DOCUMENT_NAME, shoppingCartProductSchema);
