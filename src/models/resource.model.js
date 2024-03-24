'use strict';
const { Schema, model } = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Resources';
const DOCUMENT_NAME = 'Resource';
// Declare the Schema of the Mongo model
var resourceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            default: '',
        },
        slug: {
            type: String,
            required: true,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, resourceSchema);
