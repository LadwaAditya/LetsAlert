'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Eventalert Schema
 */
var EventalertSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please evter the Event name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please enter the description of the event'
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Eventalert', EventalertSchema);
