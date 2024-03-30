'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const { generateCode } = require('../configs/common');
const COLLECTION_NAME = 'Categories';
const DOCUMENT_NAME = 'Category';

const categorySchema = new Schema(
    {
        category_name: { type: String, required: true },
        parentCategory: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        slug: {
            type: String,
            unique: true,
        },
        category_code: String,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
categorySchema.pre('save', function (next) {
    this.slug = slugify(this.category_name, {
        lower: true,
    });
    this.category_code = generateCode(this.category_name);
    next();
});
module.exports = model(DOCUMENT_NAME, categorySchema);
