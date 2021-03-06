'use strict';

/**
 * Module dependencies
 */
var eventalertsPolicy = require('../policies/eventalerts.server.policy'),
    eventalerts = require('../controllers/eventalerts.server.controller');

module.exports = function (app) {
    // Eventalerts Routes
    app.route('/api/eventalerts').all(eventalertsPolicy.isAllowed)
        .get(eventalerts.list)
        .post(eventalerts.create);

    app.route('/api/eventalertsall')
        .get(eventalerts.listall);

    app.route('/api/eventalerts/police')
        .get(eventalerts.listpolice);

    app.route('/api/eventalerts/electricity')
        .get(eventalerts.listelectricity);

    app.route('/api/eventalerts/water')
        .get(eventalerts.listwater);

    app.route('/api/eventalerts/college')
        .get(eventalerts.listcollege);

    app.route('/api/eventalerts/:eventalertId').all(eventalertsPolicy.isAllowed)
        .get(eventalerts.read)
        .put(eventalerts.update)
        .delete(eventalerts.delete);

    // Finish by binding the Eventalert middleware
    app.param('eventalertId', eventalerts.eventalertByID);
};
