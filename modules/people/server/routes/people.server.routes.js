'use strict';

/**
 * Module dependencies
 */
var peoplePolicy = require('../policies/people.server.policy'),
    people = require('../controllers/people.server.controller');

module.exports = function (app) {
    // People Routes
    app.route('/api/people')
        .get(people.list)
        .post(people.create);

    app.route('/api/people/:personId')
        .get(people.read)
        .put(people.update)
        .delete(people.delete);

    // Finish by binding the Person middleware
    app.param('personId', people.personByID);
};
