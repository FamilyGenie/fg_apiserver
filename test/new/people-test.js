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

describe('People', function() {

  var newPersonId;
  var userPersonId;

  it('login', loginUser());

  it('should create a NEW person on /api/v2/people/create CREATE', function(done) {

    var newPerson = {
      object : {
        fName : "Jane",
        mName : "Mary",
        lName : "Doe",
        sexAtBirth : "F",
        birthDate : "1985-01-01",
        birthPlace : "Hollywood, CA",
        deathDate : null,
        deathPlace : null,
        notes : null,
        user_id : "test@test.com"
      }
    };

  chai.request(server)
    .post('/api/v2/person/create')
    .set('x-access-token', authToken)
    .send(newPerson)
    .end(function(err, res) {

      if (err) return done(err);

      try {
        var resTextJson = JSON.parse(res.text);
      } catch(SyntaxError) {
        assert.fail(res.text, 'all people', 'all people could not be parsed to JSON')
      }

      res.status.should.equal(200);
      res.text.should.be.a('string');
      resTextJson.should.be.a('object');
      resTextJson.should.have.property('fName');
      resTextJson.should.have.property('lName');
      resTextJson.should.have.property('birthDate');
      resTextJson.should.have.property('deathDate');
      resTextJson.should.have.property('birthPlace');
      resTextJson.should.have.property('deathPlace');
      resTextJson.should.have.property('user_id');
      resTextJson.fName.should.equal('Jane');
      resTextJson.mName.should.equal('Mary');
      resTextJson.lName.should.equal('Doe');
      resTextJson.sexAtBirth.should.equal('F');
      resTextJson.birthDate.should.equal('1985-01-01T00:00:00.000Z');
      resTextJson.birthPlace.should.equal('Hollywood, CA');
      resTextJson.user_id.should.equal('test@test.com');
      should.not.exist(resTextJson.deathDate);
      should.not.exist(resTextJson.deathPlace);
      should.not.exist(resTextJson.notes);

      newPersonId = resTextJson._id;
      userPersonId = resTextJson.user_id;

      done();
    });
  });

  it('should return ALL people on /api/v2/people READ', function(done) {

    chai.request(server)
      .get('/api/v2/people')
      .set('x-access-token', authToken)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all people', 'all people could not be parsed to JSON')
        }

        res.should.have.status(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('array');
        resTextJson[0].should.be.a('object');
        resTextJson[0].should.have.property('fName');
        resTextJson[0].should.have.property('lName');
        resTextJson[0].should.have.property('birthDate');
        resTextJson[0].should.have.property('deathDate');
        resTextJson[0].should.have.property('birthPlace');
        resTextJson[0].should.have.property('deathPlace');
        resTextJson[0].should.have.property('user_id');
        resTextJson[0].fName.should.equal('John');
        resTextJson[0].lName.should.equal('Doe');

        done();
      });
    });


    it('should update a SINGLE person on /api/v2/person/update UPDATE', function(done) {

      var updatePerson = {
        object : {
          _id : newPersonId,
          field : "birthDate",
          value : "1972-01-02"
        }
      };

      chai.request(server)
        .post('/api/v2/person/update')
        .set('x-access-token', authToken)
        .send(updatePerson)
        .end(function(err, res) {

          if (err) return done(err);

          res.status.should.equal(200);
          res.body.should.be.a('object');
          res.body.should.have.property('fName');
          res.body.should.have.property('lName');
          res.body.should.have.property('sexAtBirth');
          res.body.should.have.property('birthDate');
          res.body.should.have.property('birthPlace');
          res.body.should.have.property('deathDate');
          res.body.should.have.property('deathPlace');
          res.body.should.have.property('user_id');
          res.body.birthDate.should.equal(updatePerson.object.value + "T00:00:00.000Z");

          done();
      });
    });

    it('should delete a SINGLE person on /api/v2/person/delete DELETE', function(done) {

      var personRemoval = {
        object : {
          _id : newPersonId,
          user_id : userPersonId
        }
      };

      chai.request(server)
        .post('/api/v2/person/delete')
        .set('x-access-token', authToken)
        .send(personRemoval)
        .end(function(err, res) {

          if (err) return done(err);

          res.status.should.equal(200);
          res.text.should.be.a('string');

          // do we need more than this for delete?

          done();
      });
    });
});

