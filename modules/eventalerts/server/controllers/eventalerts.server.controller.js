'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Eventalert = mongoose.model('Eventalert'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Eventalert
 */
exports.create = function (req, res) {
    var eventalert = new Eventalert(req.body);
    eventalert.user = req.user;

    eventalert.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventalert);
        }
    });
};

/**
 * Show the current Eventalert
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var eventalert = req.eventalert ? req.eventalert.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    eventalert.isCurrentUserOwner = req.user && eventalert.user && eventalert.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(eventalert);
};

/**
 * Update a Eventalert
 */
exports.update = function (req, res) {
    var eventalert = req.eventalert;

    eventalert = _.extend(eventalert, req.body);

    eventalert.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventalert);
        }
    });
};

/**
 * Delete an Eventalert
 */
exports.delete = function (req, res) {
    var eventalert = req.eventalert;

    eventalert.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventalert);
        }
    });
};

/**
 * List of Eventalerts
 */
exports.list = function (req, res) {
    console.log(req.user);
    Eventalert.find({user: req.user._id}).sort('-created').populate({
        path: 'user',
        select: 'displayName department city'
    }).exec(function (err, eventalerts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventalerts);
        }
    });
};

/**
 * List of All Eventalerts
 */
exports.listall = function (req, res) {
    console.log(req.user);
    Eventalert.find().sort('-created').populate({
        path: 'user',
        select: 'displayName department city'
    }).exec(function (err, eventalerts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventalerts);
        }
    });
};


/**
 * Eventalert middleware
 */
exports.eventalertByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Eventalert is invalid'
        });
    }

    Eventalert.findById(id).populate('user', 'displayName').exec(function (err, eventalert) {
        if (err) {
            return next(err);
        } else if (!eventalert) {
            return res.status(404).send({
                message: 'No Eventalert with that identifier has been found'
            });
        }
        req.eventalert = eventalert;
        next();
    });
};
