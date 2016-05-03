'use strict';

/**
 * Module dependencies
 */
var complaintsPolicy = require('../policies/complaints.server.policy'),
  complaints = require('../controllers/complaints.server.controller');

module.exports = function(app) {
  // Complaints Routes
  app.route('/api/complaints')
    .get(complaints.list)
    .post(complaints.create);

  app.route('/api/complaints/:complaintId').all(complaintsPolicy.isAllowed)
    .get(complaints.read)
    .put(complaints.update)
    .delete(complaints.delete);

  // Finish by binding the Complaint middleware
  app.param('complaintId', complaints.complaintByID);
};
