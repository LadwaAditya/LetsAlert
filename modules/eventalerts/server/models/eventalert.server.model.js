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
    required: 'Please fill Eventalert name',
    trim: true
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
