'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Complaint Schema
 */
var ComplaintSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Complaint name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    person: {
        type: String,
        trim: true
    },
    gcm: {
        type: String,
        default: '',
        trim: true
    },
    department: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Please enter the department Name'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Complaint', ComplaintSchema);
