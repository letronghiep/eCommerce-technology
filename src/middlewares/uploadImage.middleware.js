'use strict';
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const ApiError = require('../utils/ApiError');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'eCommerce-Technology',
    },
});

const uploadCloud = multer({ storage });

const uploadImage = (req, res, next) => {
    uploadCloud.array('gallery')(req, res, function (err) {
        if (err) {
            // Handle error
            return new ApiError(
                StatusCodes.BAD_REQUEST,
                'Uploading gallery failed'
            );
        }

        const images = req.files.map((img) => img.path);
        req.files.gallery = images;
        next();
    });

    // uploadCloud.single('img')(req, res, function (err) {
    //     if (err) {
    //         // Handle error
    //         return new ApiError(
    //             StatusCodes.BAD_REQUEST,
    //             'Uploading images failed'
    //         );
    //     }

    //     req.files = req.files.path;
    //     console.log(req.files);
    //     next();
    // });
};

module.exports = uploadImage;
