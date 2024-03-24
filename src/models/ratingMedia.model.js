'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'RatingMedia';
const DOCUMENT_NAME = 'RattingMedias';

const rattingMediaSchema = new Schema(
    {
        rating_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating',
            required: true,
        },
        media_url: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, rattingMediaSchema);
