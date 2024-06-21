'use strict';
const querystring = require('qs');
const crypto = require('crypto');
const moment = require('moment');
const vnpay = require('vnpay');

const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/cart.model');
const { OK, CREATED } = require('../utils/success.response');

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        );
    }
    return sorted;
};

const createCheckout = catchAsync((req, res) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;
    let orderId = moment(date).format('DDHHmmss');

    let amount = req.body.amount;
    let bankCode = req.body.bankCode || 'NCB';

    let vnpTxnRef = Math.floor(Math.random() * 99);

    let vnp_Params = {};
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_BankCode'] = bankCode;

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl);
    // res.send(vnpUrl);
});

const returnVnpCheckout = catchAsync((req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASH_SECRET;

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.status(200).json({
            message: 'Success',
            statusCodePayment: vnp_Params['vnp_ResponseCode'],
        });
    } else {
        res.status(200).json({
            message: 'Success',
            statusCodePayment: 97,
        });
    }
});

module.exports = { createCheckout, returnVnpCheckout };
