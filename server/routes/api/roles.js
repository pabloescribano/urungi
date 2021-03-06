const express = require('express');
const mongoose = require('mongoose');
const restrict = require('../../middlewares/restrict.js');
const restrictAdmin = require('../../middlewares/restrict-admin.js');
const mongooseHelper = require('../../helpers/mongoose.js');

const router = express.Router();
const Role = mongoose.model('Role');

router.param('roleId', function (req, res, next, roleId) {
    Role.findById(roleId).then(role => {
        if (role) {
            req.$role = role;
            next();
        } else {
            res.sendStatus(404);
        }
    }, err => {
        console.error(err.message);
        res.sendStatus(404);
    });
});

router.get('/', restrict, listRoles);
router.post('/', restrictAdmin, createRole);
router.get('/:roleId', restrict, getRole);
router.patch('/:roleId', restrictAdmin, updateRole);

function listRoles (req, res) {
    mongooseHelper.find(Role, req).then(response => {
        res.json(response);
    });
}

function createRole (req, res) {
    const role = new Role(req.body);
    role.companyID = 'COMPID';

    role.save().then(role => {
        res.status(201).json(role);
    }, err => {
        res.status(500).json({ error: err.message });
    });
}

function getRole (req, res) {
    res.json(req.$role);
}

function updateRole (req, res) {
    req.$role.set(req.body);
    req.$role.save().then(role => {
        res.json(role);
    }, err => {
        res.status(500).json({ error: err.message });
    });
}

module.exports = router;
