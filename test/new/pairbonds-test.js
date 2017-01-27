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

// TODO: should we use dot notation based on the created item or use a literal to check something that has just been created?
// :: create a user
// :: signup tests

describe('PairBond Relationship', function() {

  var newPairBondId;
  var userPairBondId;

  it('login', loginUser());

  it('should create a SINGLE pairbond relationship on /api/v2/pairbondrel/create CREATE', function(done) {

    var newPairBond = {
      object : {
        personOne_id : "5862cb6c05922073e7944d53",
        personTwo_id : "4751dc7d94811962f6833e42",
        relationshipType : "Marriage",
        subType : null,
        startDate : "1995-01-01",
        endDate : null,
        user_id : "test@test.com"
      }
    };

    chai.request(server)
      .post('/api/v2/pairbondrel/create')
      .set('x-access-token', authToken)
      .send(newPairBond)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all people', 'all people could not be parsed to JSON')
        }

        resTextJson.personOne_id.should.equal(newPairBond.object.personOne_id);
        resTextJson.personTwo_id.should.equal(newPairBond.object.personTwo_id);
        resTextJson.relationshipType.should.equal(newPairBond.object.relationshipType);
        resTextJson.startDate.should.equal(newPairBond.object.startDate + "T00:00:00.000Z");
        resTextJson.user_id.should.equal(newPairBond.object.user_id);
        should.not.exist(resTextJson.subType);
        should.not.exist(resTextJson.endDate);

        newPairBondId = resTextJson._id;

        done();
    });
  });

  it('should return ALL pairbond relationships on /api/v2/pairbondrels READ', function(done) {

    chai.request(server)
      .get('/api/v2/pairbondrels')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (err) return done(err);
        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all pairbonds', 'all pairbonds could not be parsed to JSON')
        }
        res.should.have.status(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('array');
        resTextJson[0].should.be.a('object');
        resTextJson[0].should.have.property('personOne_id');
        resTextJson[0].should.have.property('personTwo_id');
        resTextJson[0].should.have.property('relationshipType');
        resTextJson[0].should.have.property('subType');
        resTextJson[0].should.have.property('user_id');
        resTextJson[0].should.have.property('startDate');
        resTextJson[0].should.have.property('endDate');
        resTextJson[0].relationshipType.should.equal('Marriage');

        done();
    });
  });

  it('should update a SINGLE pairbond relationship on /api/v2/pairbondrels/update UPDATE', function(done) {

    var updatePairBondRel = {
      object : {
        _id : newPairBondId,
        field : "startDate",
        value : "2000-06-12"
      }
    };

    chai.request(server)
      .post('/api/v2/pairbondrel/update')
      .set('x-access-token', authToken)
      .send(updatePairBondRel)
      .end(function(err, res) {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('personOne_id');
        res.body.should.have.property('personTwo_id');
        res.body.should.have.property('relationshipType');
        res.body.should.have.property('subType');
        res.body.should.have.property('startDate');
        res.body.should.have.property('endDate');
        res.body.should.have.property('user_id');
        res.body.startDate.should.equal(updatePairBondRel.object.value + 'T00:00:00.000Z');

        done();
    });
  });

  it('should delete a SINGLE pairbond relationship on /api/v2/pairbondrels/delete DELETE', function(done) {

    var deletePairBondRel = {
      object : {
        _id : newPairBondId
      }
    };

    chai.request(server)
      .post('/api/v2/pairbondrel/delete')
      .set('x-access-token', authToken)
      .send(deletePairBondRel)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all pairbonds', 'all pairbonds could not be parsed to JSON')
        }

        res.status.should.equal(200);
        resTextJson.should.be.a('array');
        should.not.exist(resTextJson.find(function(p) {return p._id === newPairBondId}))

        done();
    });
  });
});

