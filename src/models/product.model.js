'use strict';

const { Schema, model, default: mongoose } = require('mongoose');
const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema(
    {
        name: {
            type: String,
            min: [5, 'Username must be more than 6 characters'],
            required: [true, 'Please enter brand name'],
        },
        brand_id: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
        },
        description: {
            type: String,
        },
        price: {
            type: Double,
            required: [true, 'Please enter price product'],
        },
        quantity_import: {
            type: Integer,
            default: 0,
        },
        quantity_sold: {
            type: Integer,
            default: 0,
        },
        promotion: {
            type: Double,
            Default: 0,
        },
        image_url: {
            type: String,
            required: [true, 'Please enter image url'],
            default: '',
        },
        publish: {
            type: Boolean,
            default: false,
        },
        attribute: {
            type: Schema.Types.Mixed,
        },
        slug: {
            type: String,
        },
        sku: {
            type: String,
        },
        created_at: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, productSchema);
