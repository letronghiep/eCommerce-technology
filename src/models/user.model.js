'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Users';
const DOCUMENT_NAME = 'User';
// Declare the Schema of the Mongo model
var userSchema = new Schema(
    {
        full_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            min: [6, 'Please enter username greater than 6 characters'],
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        accumulation_points: {
            type: Number,
            default: 0,
        },
        redemption_points: {
            type: Number,
            default: 0,
        },
        rank: {
            type: String,
            default: 'copper',
            enum: ['copper', 'silver', 'gold', 'diamond'],
        },
        role_code: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'active', 'block'],
        },
        access_token: {
            type: String,
            default: null,
        },
        refresh_token: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
