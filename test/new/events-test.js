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

describe('Events', function() {

  var newEventId;

  it('login', loginUser());

  it('should create a SINGLE event on /api/v2/event/create CREATE', function(done) {

    var newEvent = {
      object : {
        person_id : "58530a8b142db48fe3fe8c94",
        eventType : "Birth",
        eventDate : "1995-06-28",
        eventPlace : "St. Paul",
        user_id : "test@test.com"
      }
    };

    chai.request(server)
      .post('/api/v2/event/create')
      .set('x-access-token', authToken)
      .send(newEvent)
      .end(function(err, res) {

        if (err) return done(err);

        try {
          var resTextJson = JSON.parse(res.text);
        } catch(SyntaxError) {
          assert.fail(res.text, 'all events', 'all events could not be parsed to JSON')
        }

        res.status.should.equal(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('object');
        resTextJson.person_id.should.equal('58530a8b142db48fe3fe8c94');
        resTextJson.eventType.should.equal('Birth');
        resTextJson.eventDate.should.equal('1995-06-28T00:00:00.000Z');
        resTextJson.eventPlace.should.equal('St. Paul');
        resTextJson.user_id.should.equal('test@test.com');

        newEventId = resTextJson._id;

        done();
    });
  });

  it('should return ALL events on /api/v2/events READ', function(done) {

    chai.request(server)
      .get('/api/v2/events')
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
        resTextJson[0].should.have.property('person_id');
        resTextJson[0].should.have.property('type');
        resTextJson[0].should.have.property('eventDate');
        resTextJson[0].should.have.property('place');
        resTextJson[0].should.have.property('user_id');
        resTextJson[0].type.should.equal('Birth');
        resTextJson[0].person_id.should.equal('58530a8b142db48fe3fe8c94');
        resTextJson[0].place.should.equal('St. Paul');

        done();
    });
  });

  it('should update a SINGLE event on /api/v2/event/update UPDATE', function(done) {

    var updateEvent = {
      object : {
        _id : newEventId,
        field : "eventPlace",
        value : "Minneapolis"
      }
    };

    chai.request(server)
      .post('/api/v2/event/update')
      .set('x-access-token', authToken)
      .send(updateEvent)
      .end(function(err, res) {

        if (err) return done(err);

        res.status.should.equal(200);
        res.body.should.be.a('object');
        res.body.person_id.should.equal('58530a8b142db48fe3fe8c94');
        res.body.eventType.should.equal('Birth');
        res.body.eventDate.should.equal('1995-06-28T00:00:00.000Z');
        res.body.eventPlace.should.equal('Minneapolis');
        res.body.user_id.should.equal('test@test.com');

        done();
    });
  });

  it('should delete a SINGLE event on /api/v2/event/delete DELETE', function(done) {

    var deleteEvent = {
      object : {
        _id : newEventId,
        user_id : "test@test.com"
      }
    };

    chai.request(server)
      .post('/api/v2/event/delete')
      .set('x-access-token', authToken)
      .send(deleteEvent)
      .end(function(err, res) {

        if (err) return done(err);

        res.status.should.equal(200);

        done();
    });
  });

});

