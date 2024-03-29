'use strict';
const express = require('express');

const checkAuth = require('../middlewares/checkAuth');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.use(checkAuth);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/').get(getAllUsers);

module.exports = router;
