'use strict';
const express = require('express');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/').get(getAllUsers);

module.exports = router;
