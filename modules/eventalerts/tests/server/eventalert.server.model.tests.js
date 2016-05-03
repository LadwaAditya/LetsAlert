'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventalert = mongoose.model('Eventalert');

/**
 * Globals
 */
var user, eventalert;

/**
 * Unit tests
 */
describe('Eventalert Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      department:'police'
    });

    user.save(function() { 
      eventalert = new Eventalert({
        name: 'Eventalert Name',
        description:'Hello',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return eventalert.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      eventalert.name = '';

      return eventalert.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Eventalert.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
