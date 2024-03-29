'use strict';
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Role = require('../models/role.model');
const { OK, CREATED } = require('../utils/success.response');

const getAllRoles = catchAsync(async (req, res, next) => {
    const roles = await Role.find();
    if (!roles)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: roles,
    }).send(res);
});

const getRole = catchAsync(async (req, res, next) => {
    const role = await Role.findOne({ _id: req.params.id });

    if (!role)
        throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    return new OK({
        message: ReasonPhrases.OK,
        metadata: role,
    }).send(res);
});

const createRole = catchAsync(async (req, res, next) => {
    const newRole = await Role.create({
        name: req.body.name,
        status: req.body.status,
        description: req.body.description,
    });

    if (!newRole)
        throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);

    return new CREATED({
        message: ReasonPhrases.CREATED,
        metadata: newRole,
    }).send(res);
});

const updateRole = catchAsync(async (req, res, next) => {
    const roleUpdate = await Role.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return new OK({
        message: ReasonPhrases.OK,
        metadata: roleUpdate,
    }).send(res);
});

const deleteRole = catchAsync(async (req, res, next) => {
    await Role.findByIdAndUpdate(req.params.id, {
        status: 'block',
    });

    res.status(StatusCodes.NO_CONTENT).json({
        message: ReasonPhrases.NO_CONTENT,
        role: null,
    });
});

module.exports = { getAllRoles, getRole, createRole, updateRole, deleteRole };
