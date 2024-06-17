'use strict';
const express = require('express');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user.controller');
const {
    authentication,
    restrictTo,
} = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(authentication, restrictTo('admin'));
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/').get(getAllUsers);

module.exports = router;
