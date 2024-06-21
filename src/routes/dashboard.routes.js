'use strict';
const express = require('express');

const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const { getDataDashboard } = require('../controllers/dashboard.controller');

const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user.controller');

const {
    getAllOrder,
    getOrderById,
    updateStatusOrder,
} = require('../controllers/order.controller');

const {
    getAllVouchers,
    getVoucherByCode,
    createVoucher,
    updateVoucher,
    deleteVoucher,
} = require('../controllers/voucher.controller.js');

const router = express.Router();

router.use(authentication, restrictTo('admin'));

router.route('/user').get(getAllUsers);
router.route('/user/:id').get(getUser).put(updateUser).delete(deleteUser);

router.route('/order').get(getAllOrder);
router.route('/order/:id').get(getOrderById).put(updateStatusOrder);

router.route('/voucher').get(getAllVouchers).post(createVoucher);
router
    .route('/:code')
    .get(getVoucherByCode)
    .put(updateVoucher)
    .delete(deleteVoucher);

router.get('/', getDataDashboard);

module.exports = router;
