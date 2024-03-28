'use strict';
const express = require('express');
const {
    getAllRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
} = require('../controllers/role.controller');

const router = express.Router();

router.route('/:id').get(getRole).put(updateRole).delete(deleteRole);
router.route('/').get(getAllRoles).post(createRole);

module.exports = router;
