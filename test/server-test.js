var request = require('supertest');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../fg_api_server');

var user = request.agent();
var should = chai.should();

var authToken = null;

chai.use(chaiHttp);

describe('People', function() {
/*
 *   beforeEach(function(done) {
 *     user = {
 *     }
 *   })
 */

  it('should return a Forbidden Request 403 GET', function(done) {
    chai.request(server)
      .get('/people')
      .end(function(err, res) {
        res.should.have.status(403);
        done();
      });
  });

  it('login', loginUser());

  it('should return ALL people on /people GET', function(done) {
    chai.request(server)
      .get('/people')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (err) return done(err);
        res.should.have.status(200);
        done()
      });
    });
  // it('should list a SINGLE person on /people/<id> GET');
})

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
