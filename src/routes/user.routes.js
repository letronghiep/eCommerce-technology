'use strict';
const express = require('express');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user.controller');
const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/').get(getAllUsers);

module.exports = router;
