'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Complaint = mongoose.model('Complaint'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Complaint
 */
exports.create = function (req, res) {
    var complaint = new Complaint(req.body);
    console.log(req.body);
    var dept =  req.body.department.toLowerCase();
    console.log(dept);
    User.findOne({department: dept}).exec(function (err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            complaint.user = user;
            complaint.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(complaint);
                }
            });
        }

    });

};

/**
 * Show the current Complaint
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var complaint = req.complaint ? req.complaint.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    complaint.isCurrentUserOwner = req.user && complaint.user && complaint.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(complaint);
};

/**
 * Update a Complaint
 */
exports.update = function (req, res) {
    var complaint = req.complaint;

    complaint = _.extend(complaint, req.body);

    complaint.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(complaint);
        }
    });
};

/**
 * Delete an Complaint
 */
exports.delete = function (req, res) {
    var complaint = req.complaint;

    complaint.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(complaint);
        }
    });
};

/**
 * List of Complaints
 */
exports.list = function (req, res) {

    User.find({department: req.user.department}, {_id: 1}, function (err, docs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        var ids = docs.map(function (doc) {
            return doc._id;
        });
    });

    Complaint.find({department: req.user.department}).sort('-created').exec(function (err, complaints) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(complaints);
        }
    });
};

/**
 * Complaint middleware
 */
exports.complaintByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Complaint is invalid'
        });
    }

    Complaint.findById(id).populate('user', 'displayName').exec(function (err, complaint) {
        if (err) {
            return next(err);
        } else if (!complaint) {
            return res.status(404).send({
                message: 'No Complaint with that identifier has been found'
            });
        }
        req.complaint = complaint;
        next();
    });
};
