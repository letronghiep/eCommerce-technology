'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const COLLECTION_NAME = 'News';
const DOCUMENT_NAME = 'News';

const newsSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        status: {
            type: String,
            enum: ['hidden', 'active', 'block'],
            default: 'active',
        },
        slug: String,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

newsSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});
module.exports = model(DOCUMENT_NAME, newsSchema);
