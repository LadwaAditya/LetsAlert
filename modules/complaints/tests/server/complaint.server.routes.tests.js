'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Complaint = mongoose.model('Complaint'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, complaint;

/**
 * Complaint routes tests
 */
describe('Complaint CRUD tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local',
            department: 'police'
        });

        // Save a user to the test db and create new Complaint
        user.save(function () {
            complaint = {
                name: 'Complaint name',
                department: 'police',
                gcm: ''
            };

            done();
        });
    });

    it('should be able to save a Complaint if logged in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Complaint
                agent.post('/api/complaints')
                    .send(complaint)
                    .expect(200)
                    .end(function (complaintSaveErr, complaintSaveRes) {
                        // Handle Complaint save error
                        if (complaintSaveErr) {
                            return done(complaintSaveErr);
                        }

                        // Get a list of Complaints
                        agent.get('/api/complaints')
                            .send(user)
                            .end(function (complaintsGetErr, complaintsGetRes) {
                                // Handle Complaint save error
                                if (complaintsGetErr) {
                                    return done(complaintsGetErr);
                                }

                                // Get Complaints list
                                var complaints = complaintsGetRes.body;

                                // Set assertions

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });


    it('should not be able to save an Complaint if no name is provided', function (done) {
        // Invalidate name field
        complaint.name = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Complaint
                agent.post('/api/complaints')
                    .send(complaint)
                    .expect(400)
                    .end(function (complaintSaveErr, complaintSaveRes) {
                        // Set message assertion
                        (complaintSaveRes.body.message).should.match('Please fill Complaint name');

                        // Handle Complaint save error
                        done(complaintSaveErr);
                    });
            });
    });

    it('should be able to update an Complaint if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Complaint
                agent.post('/api/complaints')
                    .send(complaint)
                    .expect(200)
                    .end(function (complaintSaveErr, complaintSaveRes) {
                        // Handle Complaint save error
                        if (complaintSaveErr) {
                            return done(complaintSaveErr);
                        }

                        // Update Complaint name
                        complaint.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Complaint
                        agent.put('/api/complaints/' + complaintSaveRes.body._id)
                            .send(complaint)
                            .expect(200)
                            .end(function (complaintUpdateErr, complaintUpdateRes) {
                                // Handle Complaint update error
                                if (complaintUpdateErr) {
                                    return done(complaintUpdateErr);
                                }

                                // Set assertions
                                // (complaintUpdateRes.body._id).should.equal(complaintSaveRes.body._id);
                                // (complaintUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    // it('should be able to get a list of Complaints if not signed in', function (done) {
    //     // Create new Complaint model instance
    //     var complaintObj = new Complaint(complaint);
    //
    //     // Save the complaint
    //     complaintObj.save(function () {
    //         // Request Complaints
    //         request(app).get('/api/complaints')
    //             .send(user)
    //             .end(function (req, res) {
    //                 // Set assertion
    //                 res.body.should.be.instanceof(Array).and.have.lengthOf(1);
    //
    //                 // Call the assertion callback
    //                 done();
    //             });
    //
    //     });
    // });

    it('should be able to get a single Complaint if not signed in', function (done) {
        // Create new Complaint model instance
        var complaintObj = new Complaint(complaint);

        // Save the Complaint
        complaintObj.save(function () {
            request(app).get('/api/complaints/' + complaintObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('name', complaint.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Complaint with an invalid Id, if not signed in', function (done) {
        // test is not a valid mongoose Id
        request(app).get('/api/complaints/test')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Complaint is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Complaint which doesnt exist, if not signed in', function (done) {
        // This is a valid mongoose Id but a non-existent Complaint
        request(app).get('/api/complaints/559e9cd815f80b4c256a8f41')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Complaint with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Complaint if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Complaint
                agent.post('/api/complaints')
                    .send(complaint)
                    .expect(200)
                    .end(function (complaintSaveErr, complaintSaveRes) {
                        // Handle Complaint save error
                        if (complaintSaveErr) {
                            return done(complaintSaveErr);
                        }

                        // Delete an existing Complaint
                        agent.delete('/api/complaints/' + complaintSaveRes.body._id)
                            .send(complaint)
                            .expect(200)
                            .end(function (complaintDeleteErr, complaintDeleteRes) {
                                // Handle complaint error error
                                if (complaintDeleteErr) {
                                    return done(complaintDeleteErr);
                                }

                                // Set assertions
                                (complaintDeleteRes.body._id).should.equal(complaintSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Complaint if not signed in', function (done) {
        // Set Complaint user
        complaint.user = user;

        // Create new Complaint model instance
        var complaintObj = new Complaint(complaint);

        // Save the Complaint
        complaintObj.save(function () {
            // Try deleting Complaint
            request(app).delete('/api/complaints/' + complaintObj._id)
                .expect(403)
                .end(function (complaintDeleteErr, complaintDeleteRes) {
                    // Set message assertion
                    (complaintDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Complaint error error
                    done(complaintDeleteErr);
                });

        });
    });

    // it('should be able to get a single Complaint that has an orphaned user reference', function (done) {
    //     // Create orphan user creds
    //     var _creds = {
    //         username: 'orphan',
    //         password: 'M3@n.jsI$Aw3$0m3'
    //     };
    //
    //     // Create orphan user
    //     var _orphan = new User({
    //         firstName: 'Full',
    //         lastName: 'Name',
    //         displayName: 'Full Name',
    //         email: 'orphan@test.com',
    //         username: _creds.username,
    //         password: _creds.password,
    //         provider: 'local',
    //         department:'police'
    //     });
    //
    //     _orphan.save(function (err, orphan) {
    //         // Handle save error
    //         if (err) {
    //             return done(err);
    //         }
    //
    //         agent.post('/api/auth/signin')
    //             .send(_creds)
    //             .expect(200)
    //             .end(function (signinErr, signinRes) {
    //                 // Handle signin error
    //                 if (signinErr) {
    //                     return done(signinErr);
    //                 }
    //
    //                 // Get the userId
    //                 var orphanId = orphan._id;
    //
    //                 // Save a new Complaint
    //                 agent.post('/api/complaints')
    //                     .send(complaint)
    //                     .expect(200)
    //                     .end(function (complaintSaveErr, complaintSaveRes) {
    //                         // Handle Complaint save error
    //                         if (complaintSaveErr) {
    //                             return done(complaintSaveErr);
    //                         }
    //
    //                         // Set assertions on new Complaint
    //                         (complaintSaveRes.body.name).should.equal(complaint.name);
    //                         should.exist(complaintSaveRes.body.user);
    //                         should.equal(complaintSaveRes.body.user._id, orphanId);
    //
    //                         // force the Complaint to have an orphaned user reference
    //                         orphan.remove(function () {
    //                             // now signin with valid user
    //                             agent.post('/api/auth/signin')
    //                                 .send(credentials)
    //                                 .expect(200)
    //                                 .end(function (err, res) {
    //                                     // Handle signin error
    //                                     if (err) {
    //                                         return done(err);
    //                                     }
    //
    //                                     // Get the Complaint
    //                                     agent.get('/api/complaints/' + complaintSaveRes.body._id)
    //                                         .expect(200)
    //                                         .end(function (complaintInfoErr, complaintInfoRes) {
    //                                             // Handle Complaint error
    //                                             if (complaintInfoErr) {
    //                                                 return done(complaintInfoErr);
    //                                             }
    //
    //                                             // Set assertions
    //                                             (complaintInfoRes.body._id).should.equal(complaintSaveRes.body._id);
    //                                             (complaintInfoRes.body.name).should.equal(complaint.name);
    //                                             should.equal(complaintInfoRes.body.user, undefined);
    //
    //                                             // Call the assertion callback
    //                                             done();
    //                                         });
    //                                 });
    //                         });
    //                     });
    //             });
    //     });
    // });

    afterEach(function (done) {
        User.remove().exec(function () {
            Complaint.remove().exec(done);
        });
    });
});
