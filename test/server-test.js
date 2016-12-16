var request = require('supertest');
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var sinon = require('sinon');

var server = require('../fg_api_server');
var config = require('./_config');
var PersonModel = require('../models/person.model');

var user = request.agent();
var should = chai.should();
var expect = chai.expect;

var authToken = null;

chai.use(chaiHttp);
fg_test = mongoose.createConnection('mongodb://localhost/fg_test');

describe('Authentication', function() {

  it('should return a Forbidden Request 403 GET', function(done) {
    chai.request(server)
      .get('/people')
      .end(function(err, res) {
        res.should.have.status(403);
        JSON.parse(res.text).success.should.equal(false);
        done();
      });
  });

  it('should return a successful login', function(done) {
    chai.request(server)
    .get('/people')
    .set('x-access-token', authToken)
    .end(function(err, res) {
      res.should.have.status(200);
      done();
    });
  });

  it('should return a successful logout', function(done) {
    chai.request(server)
      .get('/people')
      .set('x-access-token', null)
      .end(function(err, res) {
        res.should.have.status(403);
        done();
      });
  });

});

describe('People', function() {

  /*
   * before(function(done) {
   *   console.log('login')
   *   it('login', loginUser())
   *   done();
   * });
   */

  /*
   * after(function(done) {
   *   console.log('logout')
   *   logoutUser()
   *   done();
   * });
   */

  it('login', loginUser());

  it('should return ALL people on /people GET', function(done) {
    chai.request(server)
      .get('/people')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (err) return done(err);
        // not sure if this is appropriate
        var resTextJson = JSON.parse(res.text);
        // console.log(JSON.parse(res.text)[0])
        res.should.have.status(200);
        // res.text.should.be.a('object'); // I think
        // res.text.should.be.json;
        res.text.should.be.a('string');
        resTextJson.should.be.a('array');
        resTextJson[0].should.be.a('object');
        resTextJson[0].should.have.property('fName');
        resTextJson[0].should.have.property('lName');
        resTextJson[0].should.have.property('birthDate');
        resTextJson[0].should.have.property('deathDate');
        resTextJson[0].fName.should.equal('John');
        resTextJson[0].lName.should.equal('Doe');

        done();
      });
    });

/*
 *   it('should create a NEW person on /create POST', function(done) {
 *     newPerson = {
 *       fName : "Jane",
 *       mName : "Mary",
 *       lName : "Doe",
 *       sexAtBirth : "F",
 *       birthDate : "1985-01-01",
 *       birthPlace : "Hollywood, CA",
 *       deathDate : null,
 *       deathPlace : null,
 *       notes : null,
 *       user_id : "test@user.com"
 *     }
 *     chai.request(server)
 *       .post('/create')
 *       .set('x-access-token', authToken)
 *       .set('req.body.objectType', 'person')
 *       .end(function(err, res) {
 *         if (err) return done(err);
 *
 *       });
 *     done();
 *   });
 */

  /*
   * it('should update a SINGLE person on /api/v2/update UPDATE', function(done) {
   *   done();
   * });
   */

  /*
   * it('should delete a SINGLE person on /delete DELETE', function(done) {
   *   done();
   * });
   */

});

/*
 * describe('PairBondRel', function() {
 *
 * });
 */

/*
 * describe('ParentalRel', function() {
 *
 * });
 */

/*
 * describe('ParentalRelType', function() {
 *
 * });
 */

/*
 * describe('PersonChangeModel', function() {
 *
 * });
 */

/*
 *   it('should list a SINGLE person on /people/<id> GET', function(done) {
 *     var newPerson = new PersonModel ({
 *       fName: 'John',
 *       mName: 'A',
 *       lName: 'Doe',
 *       sexAtBirth: 'M',
 *       birthDate: '1947-08-27T00:00:00.000Z',
 *       birthPlace: 'Hollywood, CA',
 *       __v: 0,
 *       notes: null,
 *       deathPlace: '',
 *       deathDate: '2007-03-12T00:00:00.000Z',
 *       user_id: 'test@test.com'
 *     });
 *
 *     newPerson.save(function(err, data) {
 *       chai.request(server)
 *         .get('/people/' + data.id)
 *         // .set('x-access-token', authToken)
 *         .end(function(err, res) {
 *           res.should.have.status(200);
 *           // res.should.be.json;
 *           // res.text.should.be.a('object');
 *
 *         });
 *     });
 *   });
 */

describe('Events', function() {

  it('should return ALL events on /events GET', function(done) {
    chai.request(server)
      .get('/events')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (err) return done(err);
        var resTextJson = JSON.parse(res.text);
        res.should.have.status(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('array');
        resTextJson[0].should.be.a('object');
        resTextJson[0].should.have.property('person_id');
        resTextJson[0].should.have.property('type');
        resTextJson[0].should.have.property('eventDate');
        resTextJson[0].should.have.property('place');
        resTextJson[0].should.have.property('user_id');
        resTextJson[0].type.should.equal('Birthday');
        resTextJson[0].person_id.should.equal('57c2f3bdb9f81e5b42bc2756');
        resTextJson[0].place.should.equal('Hollywood, CA');

        done();
      });
  });

});

// login as a test user to do tests after authentication
function loginUser() {
  return function(done) {
    chai.request(server)
      .post('/api/v1/login')
      .send({username: 'test@test.com', password: 'pw'})
      .end(onResponse);

      function onResponse(err, res) {
        if (err) return done(err);
        authToken = res.body.token;
        return done();
      }
  }
}

/*
 * function logoutUser() {
 *   return function(done) {
 *     chai.request(server)
 *       .post('/api/v1/login')
 *       .send({})
 *       .end(onResponse);
 *
 *       function onResponse(err,res) {
 *         if (err) return done(err);
 *         authToken = null;
 *         return done
 *       }
 *   }
 * }
 */
