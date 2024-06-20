'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Vouchers';
const DOCUMENT_NAME = 'Voucher';

const voucherSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        type_of: {
            type: String,
            default: 'price',
            enum: ['percentage', 'price'],
        },
        value: {
            type: Number,
        },
        expiration_date: {
            type: Date,
            default: new Date(),
        },
        status: {
            type: String,
            default: 'enable',
            enum: ['disable', 'enable'],
        },
        user: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, voucherSchema);
