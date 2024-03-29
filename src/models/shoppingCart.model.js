'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'ShoppingCart';
const DOCUMENT_NAME = 'ShoppingCart';

const shoppingCartSchema = new Schema(
    {
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

module.exports = model(DOCUMENT_NAME, shoppingCartSchema);
