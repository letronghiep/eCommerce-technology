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
    req.urlFile = {};

    uploadCloud.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'gallery', maxCount: 5 },
    ])(req, res, function (err) {
        if (err) {
            // Handle error
            return new ApiError(StatusCodes.BAD_REQUEST, 'Upload image failed');
        }
        console.log(req.files);
        req.urlFile.avatar = req.files['avatar'][0].path;

        if (req.files['gallery'].length <= 0) {
            next();
        }

        const gallery = req.files['gallery'].map((img) => img.path);
        req.urlFile.gallery = gallery;
        req.files = {};
        next();
    });
};

const uploadAvatar = (req, res, next) => {
    req.urlFile = {};

    uploadCloud.single('avatar')(req, res, function (err) {
        if (err) {
            // Handle error
            return new ApiError(StatusCodes.BAD_REQUEST, 'Upload image failed');
        }

        req.urlFile.avatar = req.file.path;
        next();
    });
};

module.exports = { uploadImage, uploadAvatar };
