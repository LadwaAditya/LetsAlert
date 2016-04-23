'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    validator = require('validator'),
    Schema = mongoose.Schema;

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
    return validator.isEmail(email);
};

var validatePhone = function (phone) {
    return phone.toString().length === 10;
};

/**
 * Person Schema
 */
var PersonSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Person name',
        trim: true
    },
    gcm: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        default: '',
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    subscribe: {
        type: [String],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        default: '',
        unique: true,
        required: 'Enter your Phone Number',
        validate: [validatePhone, 'Enter a 10 digit phone number']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Person', PersonSchema);
