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
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
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
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
