var request = require('supertest');
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var sinon = require('sinon');

var server = require('../fg_api_server');
var PersonModel = require('../models/person.model');

var user = request.agent();
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var authToken = null;

chai.use(chaiHttp);

testUser = { username : 'test@test.com', password : 'pw'};

var loginUser = require('./login-config.js')(chai, chaiHttp, server, testUser)

describe('Authentication', function() {

  // TODO: create a user

  // it('should create a new user', function(done) {
  //
  //   newUser = {
  //     userName : 'testUser',
  //     password : 'password',
  //     firstName : 'Test',
  //     lastName : 'User'
  //   }
  //
  //   chai.request(server)
  //     .post('/signup')
  //     .send(newUser)
  //     .end(function(err, res) {
  //       done();
  //     })
  // })

  // it('should return that the user already exists', function(done) {
  //   done();
  // })

  it('should return a Forbidden Request 403', function(done) {

    chai.request(server)
      .get('/api/v2/people')
      .set('x-access-token', null)
      .end(function(err, res) {
        res.should.have.status(403);
        res.body.should.have.property('success');
        res.body.success.should.equal(false);

        done();
    });
  });

  it('login', loginUser());

  it('should return a successful login', function(done) {

    chai.request(server)
      .get('/api/v2/people')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        res.should.have.status(200);

        done();
    });
  });

  it('should return a successful logout', function(done) {

    chai.request(server)
      .get('/api/v2/people')
      .set('x-access-token', null)
      .end(function(err, res) {
        res.should.have.status(403);

        done();
    });
  });

  // TODO: signup tests

});

// login as a test user for testing after authentication
function loginUser() {
  return function(done) {
    chai.request(server)
      .post('/api/v1/login')
      .send(testUser)
      .end(onResponse);

      function onResponse(err, res) {
        if (err) return done(err);
        authToken = res.body.token;
        return done();
      }
  }
}
