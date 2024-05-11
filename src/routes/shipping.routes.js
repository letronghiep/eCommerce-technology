'use strict';
const express = require('express');
const {
    getAllAddressShipping,
    createAddressShipping,
    updateAddressShipping,
    deleteAddressShipping,
} = require('../controllers/shipping.controller');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(authentication);
router.route('/:id').put(updateAddressShipping).delete(deleteAddressShipping);
router.route('/').get(getAllAddressShipping).post(createAddressShipping);

module.exports = router;
