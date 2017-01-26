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

describe('Staging Gedcom Imports', function() {

  it('login', loginUser);

  it('should get ALL people on /api/v2/staging/people', function(done) {
      chai.request(server)
        .get('/api/v2/staging/people')
        .set('x-access-token', authToken)
        .end(function(err, res) {

          if (err) return done(err);

          try {
            var resTextJson = JSON.parse(res.text);
          } catch(SyntaxError) {
            assert.fail(res.text, 'all pairbonds', 'all pairbonds could not be parsed to JSON')
          }

          res.status.should.equal(200);
          resTextJson.should.be.a('array');
          

          done();
        });
  });
});

