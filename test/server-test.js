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
var assert = chai.assert;

var authToken = null;

chai.use(chaiHttp);

testUser = { username : 'test@test.com', password : 'pw'};

// TODO: should we use dot notation based on the created item or use a literal to check something that has just been created?
// :: create a user
// :: signup tests

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
        resTextJson.should.be.a('object');
        resTextJson.ok.should.equal(1);

        done();
    });
  });
});

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



describe('Events', function() {

  var newEventId;

  it('login', loginUser());

  it('should create a SINGLE event on /api/v2/event/create CREATE', function(done) {

    var newEvent = {
      object : {
        person_id : "58530a8b142db48fe3fe8c94",
        type : "Birth",
        eventDate : "1995-06-28",
        place : "St. Paul",
        details : "",
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
        resTextJson.type.should.equal('Birth');
        resTextJson.eventDate.should.equal('1995-06-28T00:00:00.000Z');
        resTextJson.place.should.equal('St. Paul');
        resTextJson.details.should.equal('');
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
        field : "place",
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
        res.body.type.should.equal('Birth');
        res.body.eventDate.should.equal('1995-06-28T00:00:00.000Z');
        res.body.place.should.equal('Minneapolis');
        res.body.details.should.equal('');
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

describe('Gedcom Imports', function() {

  it('login', loginUser);

});

describe('Staging Gedcom Imports', function() {

  it('login', loginUser);

  it('should get ALL people on /api/staging/people', function(done) {
      chai.request(server)
        .get('/api/staging/people')
        .set('x-access-token', authToken)
        .end(function(err, res) {

          if (err) return done(err);

          res.status.should.equal(200);
        })
  });
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
