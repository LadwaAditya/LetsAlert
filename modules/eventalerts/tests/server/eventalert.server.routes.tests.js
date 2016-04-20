'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventalert = mongoose.model('Eventalert'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, eventalert;

/**
 * Eventalert routes tests
 */
describe('Eventalert CRUD tests', function () {

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
      provider: 'local'
    });

    // Save a user to the test db and create new Eventalert
    user.save(function () {
      eventalert = {
        name: 'Eventalert name'
      };

      done();
    });
  });

  it('should be able to save a Eventalert if logged in', function (done) {
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

        // Save a new Eventalert
        agent.post('/api/eventalerts')
          .send(eventalert)
          .expect(200)
          .end(function (eventalertSaveErr, eventalertSaveRes) {
            // Handle Eventalert save error
            if (eventalertSaveErr) {
              return done(eventalertSaveErr);
            }

            // Get a list of Eventalerts
            agent.get('/api/eventalerts')
              .end(function (eventalertsGetErr, eventalertsGetRes) {
                // Handle Eventalert save error
                if (eventalertsGetErr) {
                  return done(eventalertsGetErr);
                }

                // Get Eventalerts list
                var eventalerts = eventalertsGetRes.body;

                // Set assertions
                (eventalerts[0].user._id).should.equal(userId);
                (eventalerts[0].name).should.match('Eventalert name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Eventalert if not logged in', function (done) {
    agent.post('/api/eventalerts')
      .send(eventalert)
      .expect(403)
      .end(function (eventalertSaveErr, eventalertSaveRes) {
        // Call the assertion callback
        done(eventalertSaveErr);
      });
  });

  it('should not be able to save an Eventalert if no name is provided', function (done) {
    // Invalidate name field
    eventalert.name = '';

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

        // Save a new Eventalert
        agent.post('/api/eventalerts')
          .send(eventalert)
          .expect(400)
          .end(function (eventalertSaveErr, eventalertSaveRes) {
            // Set message assertion
            (eventalertSaveRes.body.message).should.match('Please fill Eventalert name');

            // Handle Eventalert save error
            done(eventalertSaveErr);
          });
      });
  });

  it('should be able to update an Eventalert if signed in', function (done) {
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

        // Save a new Eventalert
        agent.post('/api/eventalerts')
          .send(eventalert)
          .expect(200)
          .end(function (eventalertSaveErr, eventalertSaveRes) {
            // Handle Eventalert save error
            if (eventalertSaveErr) {
              return done(eventalertSaveErr);
            }

            // Update Eventalert name
            eventalert.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Eventalert
            agent.put('/api/eventalerts/' + eventalertSaveRes.body._id)
              .send(eventalert)
              .expect(200)
              .end(function (eventalertUpdateErr, eventalertUpdateRes) {
                // Handle Eventalert update error
                if (eventalertUpdateErr) {
                  return done(eventalertUpdateErr);
                }

                // Set assertions
                (eventalertUpdateRes.body._id).should.equal(eventalertSaveRes.body._id);
                (eventalertUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Eventalerts if not signed in', function (done) {
    // Create new Eventalert model instance
    var eventalertObj = new Eventalert(eventalert);

    // Save the eventalert
    eventalertObj.save(function () {
      // Request Eventalerts
      request(app).get('/api/eventalerts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Eventalert if not signed in', function (done) {
    // Create new Eventalert model instance
    var eventalertObj = new Eventalert(eventalert);

    // Save the Eventalert
    eventalertObj.save(function () {
      request(app).get('/api/eventalerts/' + eventalertObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', eventalert.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Eventalert with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventalerts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Eventalert is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Eventalert which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Eventalert
    request(app).get('/api/eventalerts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Eventalert with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Eventalert if signed in', function (done) {
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

        // Save a new Eventalert
        agent.post('/api/eventalerts')
          .send(eventalert)
          .expect(200)
          .end(function (eventalertSaveErr, eventalertSaveRes) {
            // Handle Eventalert save error
            if (eventalertSaveErr) {
              return done(eventalertSaveErr);
            }

            // Delete an existing Eventalert
            agent.delete('/api/eventalerts/' + eventalertSaveRes.body._id)
              .send(eventalert)
              .expect(200)
              .end(function (eventalertDeleteErr, eventalertDeleteRes) {
                // Handle eventalert error error
                if (eventalertDeleteErr) {
                  return done(eventalertDeleteErr);
                }

                // Set assertions
                (eventalertDeleteRes.body._id).should.equal(eventalertSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Eventalert if not signed in', function (done) {
    // Set Eventalert user
    eventalert.user = user;

    // Create new Eventalert model instance
    var eventalertObj = new Eventalert(eventalert);

    // Save the Eventalert
    eventalertObj.save(function () {
      // Try deleting Eventalert
      request(app).delete('/api/eventalerts/' + eventalertObj._id)
        .expect(403)
        .end(function (eventalertDeleteErr, eventalertDeleteRes) {
          // Set message assertion
          (eventalertDeleteRes.body.message).should.match('User is not authorized');

          // Handle Eventalert error error
          done(eventalertDeleteErr);
        });

    });
  });

  it('should be able to get a single Eventalert that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Eventalert
          agent.post('/api/eventalerts')
            .send(eventalert)
            .expect(200)
            .end(function (eventalertSaveErr, eventalertSaveRes) {
              // Handle Eventalert save error
              if (eventalertSaveErr) {
                return done(eventalertSaveErr);
              }

              // Set assertions on new Eventalert
              (eventalertSaveRes.body.name).should.equal(eventalert.name);
              should.exist(eventalertSaveRes.body.user);
              should.equal(eventalertSaveRes.body.user._id, orphanId);

              // force the Eventalert to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Eventalert
                    agent.get('/api/eventalerts/' + eventalertSaveRes.body._id)
                      .expect(200)
                      .end(function (eventalertInfoErr, eventalertInfoRes) {
                        // Handle Eventalert error
                        if (eventalertInfoErr) {
                          return done(eventalertInfoErr);
                        }

                        // Set assertions
                        (eventalertInfoRes.body._id).should.equal(eventalertSaveRes.body._id);
                        (eventalertInfoRes.body.name).should.equal(eventalert.name);
                        should.equal(eventalertInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Eventalert.remove().exec(done);
    });
  });
});
