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

describe('Parental Relationship', function() {

  var newParentalRelId;
  var newUserId;

  it('login', loginUser());

  it('should create a SINGLE parental relationship on /api/v2/parentalrel/create CREATE', function(done) {

    var newParentalRel = {
    	object:  {
        child_id : "57c2f3bdb9f81e5b42bc2756",
        parent_id : "57c7e09cd9ecdb493289098b",
        relationshipType : "Mother",
        subType : "Biological",
        startDate : "1947-08-27T00:00:00.000Z",
        endDate : null,
        __v : 0,
        user_id : "test@test.com"
    	}
    };

    chai.request(server)
      .post('/api/v2/parentalrel/create')
      .set('x-access-token', authToken)
      .send(newParentalRel)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all parentalrel', 'all parentalrel could not be parsed to JSON')
        }

        res.should.have.status(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('object');
        resTextJson.child_id.should.equal('57c2f3bdb9f81e5b42bc2756');
        resTextJson.parent_id.should.equal('57c7e09cd9ecdb493289098b');
        resTextJson.relationshipType.should.equal('Mother');
        resTextJson.subType.should.equal('Biological');
        resTextJson.startDate.should.equal('1947-08-27T00:00:00.000Z');
        should.not.exist(resTextJson.endDate);
        resTextJson.user_id.should.equal('test@test.com');

        newParentalRelId = resTextJson._id;

        done();
      })
  });

  it('should retrieve ALL parental relationships on /api/v2/parentalrel READ', function(done) {

    chai.request(server)
      .get('/api/v2/parentalrels')
      .set('x-access-token', authToken)
      .end(function(err, res) {

        if(err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all parentalrel', 'all parentalrel could not be parsed to JSON')
        }

        res.should.have.status(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('array');
        resTextJson[0].should.be.a('object');
        resTextJson[0].should.have.property('child_id');
        resTextJson[0].should.have.property('parent_id');
        resTextJson[0].should.have.property('relationshipType');
        resTextJson[0].should.have.property('startDate');
        resTextJson[0].should.have.property('user_id');
        // resTextJson[0].child_id.should.equal('');
        // resTextJson[0].parent_id.should.equal('');
        // resTextJson[0].relationshipType.should.equal('');

        done();
    });
  });

  it('should update a SINGLE parental relationship on /api/v2/parentalrel/update UPDATE', function(done) {

    var updateParentalRel = {
    	object : {
    	_id : newParentalRelId,
    	field : "relationshipType",
    	value : "Father"
      }
    };

    chai.request(server)
      .post('/api/v2/parentalrel/update')
      .set('x-access-token', authToken)
      .send(updateParentalRel)
      .end(function(err, res) {

        if (err) return done(err);

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.child_id.should.equal('57c2f3bdb9f81e5b42bc2756');
        res.body.parent_id.should.equal('57c7e09cd9ecdb493289098b');
        res.body.relationshipType.should.equal('Father');
        res.body.subType.should.equal('Biological');
        res.body.user_id.should.equal('test@test.com');
        should.not.exist(res.body.endDate);

        done();
    });
  });

  it('should delete a SINGLE parental relationship on /api/v2/parentalrel/delete DELETE', function(done) {

    var deleteParentalRel = {
    	object : {
    		_id : newParentalRelId
      }
    };

    chai.request(server)
      .post('/api/v2/parentalrel/delete')
      .set('x-access-token', authToken)
      .send(deleteParentalRel)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all pairbonds', 'all pairbonds could not be parsed to JSON')
        }

        res.status.should.equal(200);
        res.text.should.be.a('string');

        // More?

        done();
    });
  });
});

describe('Parental Relationship Type', function() {

  it('login', loginUser());

  it('should retrieve ALL parental relationship types on /api/v2/parentalreltypes CREATE', function(done) {

    chai.request(server)
      .get('/api/v2/parentalreltypes')
      .set('x-access-token', authToken)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all parentalrel', 'all parentalrel could not be parsed to JSON')
        }

        res.should.have.status(200);

        done();
    });
  });
});

