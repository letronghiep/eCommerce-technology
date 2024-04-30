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
        topic: {
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
        tags: String,
        comment: [
            {
                commentator: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                content: {
                    type: String,
                },
                create_at: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

newsSchema.pre('save', function (next) {
    this.tags = slugify(this.title, { lower: true });
    next();
});
module.exports = model(DOCUMENT_NAME, newsSchema);
