'use strict';
const express = require('express');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');
const {
    getAllVouchers,
    getVoucherByCode,
    createVoucher,
    updateVoucher,
    deleteVoucher,
} = require('../controllers/voucher.controller.js');

const router = express.Router();

router.use(authentication);

router
    .route('/:code')
    .get(getVoucherByCode)
    .put(updateVoucher)
    .delete(deleteVoucher);

router.route('/').get(getAllVouchers).post(createVoucher);

module.exports = router;
