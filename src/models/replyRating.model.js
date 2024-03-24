'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'ReplyRatings';
const DOCUMENT_NAME = 'ReplyRating';

const replyRatingSchema = new Schema(
    {
        rating_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reply: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, replyRatingSchema);
