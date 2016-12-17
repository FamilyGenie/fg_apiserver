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

testUser = { username : 'test@test.com', password : 'pw'};


describe('Authentication', function() {


  it('should return a Forbidden Request 403 GET', function(done) {
    // TODO: does not have 403 status instead, 200
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
    // loginUser()
    chai.request(server)
    .get('/api/v2/people')
    .set('x-access-token', authToken)
    .end(function(err, res) {
      res.should.have.status(200);
      res.text.should.be.a('string');
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



describe('People', function() {

  it('login', loginUser())

  it('should return ALL people on /api/v2/people GET', function(done) {
    chai.request(server)
      .get('/api/v2/people')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (err) return done(err);
        // not sure if this is appropriate
        var resTextJson = JSON.parse(res.text);
        res.should.have.status(200);
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


    it('should create a NEW person on /api/v2/person/create POST', function(done) {
      newPerson = {
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
      };
      chai.request(server)
        .post('api/v2/person/create')
        .set('x-access-token', authToken)
        .set('Content-Type', 'application/json')
        .send({object: newPerson})
        .end(function(err, res) {
          console.log("res", res)
          res.should.have.status(200);
        });
      done();
    });


    it('should update a SINGLE person on /api/v2/update UPDATE', function(done) {
      done();
    });

    it('should delete a SINGLE person on /delete DELETE', function(done) {

    authToken = null;

      done();
    });

});

describe('PairBond Relationship', function() {

  it('login', loginUser());

  it('should return all pairbond relationships on /api/v2/pairbondrels GET', function(done) {
    chai.request(server)
      .get('/api/v2/pairbondrels')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (err) return done(err);
        var resTextJson = JSON.parse(res.text);
        res.should.have.status(200);
        res.text.should.be.a('string');
        resTextJson.should.be.a('array');
        resTextJson[0].should.be.a('object');
        resTextJson[0].should.have.property('personOne_id');
        resTextJson[0].should.have.property('personTwo_id');
        resTextJson[0].should.have.property('relationshipType');
        resTextJson[0].should.have.property('subType');
        resTextJson[0].should.have.property('user_id');
        // resTextJson[0].personOne_id.should.equal('');
        // resTextJson[0].personTwo_id.should.equal('');
        // resTextJson[0].relationhshipType.should.equal('');
      });

    done();
  });

  it('should update a single pairbond relationship on /api/v2/pairbondrels/update UPDATE', function(done) {
    done();
  });

  it('should create a single pairbond relationship on /api/v2/pairbondrels/create CREATE', function(done) {
    done();
  });

  it('should delete a single pairbond relationship on /api/v2/pairbondrels/delete', function(done) {
    done();
  })

});




describe('Parental Relationship', function() {

  it('login', loginUser());

  it('should retrieve all parental relationships on /api/v2/parentalrel GET', function(done) {
    chai.request(server)
      .get('/api/v2/parentalrel')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if(err) return done(err);
        var resTextJson = JSON.parse(res.text);
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
      });
    done();
  });

  it('should update a single parental relationship on /api/v2/parentalrel/update UPDATE', function(done) {
    done();
  });

  it('should create a single parental relationship on /api/v2/parentalrel/create CREATE', function(done) {
    done();
  });

  it('should delete a single parental relationship on /api/v2/parentalrel/delete DELETE', function(done) {
    done();
  });


});




describe('Parental Relationship Type', function() {

    it('login', loginUser());

    it('should retrieve all parental relationship types on /api/v2/parentalreltypes GET', function(done) {
      chai.request(server)
        .get('/api/v2/parentelreltypes')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          if (err) return done(err);
          var resTextJson = JSON.parse(res.text);
          res.should.have.status(200);
          res.text.should.be.a('string');
          resTextJson.should.be.a('array');
          resTextJson[0].should.be.a('object');
          resTextJson[0].should.have.property('parentalRelType');
          // resTextJson[0].parentalRelType.should.equal('');
        });
      done();
    });
});

describe('Events', function() {

  it('login', loginUser());

  it('should return ALL events on /api/v2/events GET', function(done) {
    chai.request(server)
      .get('/api/v2/events')
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
      .send(testUser)
      .end(onResponse);

      function onResponse(err, res) {
        if (err) return done(err);
        authToken = res.body.token;
        return done();
      }
  }
}
