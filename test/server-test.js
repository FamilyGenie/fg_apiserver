var request = require('superagent');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../fg_api_server');

var user = request.agent();
var should = chai.should();

chai.use(chaiHttp);

/*
 * user
 *   .post('http://localhost:3500/api/v1/login')
 *   .send({ user: 'test@test.com', password: 'pw' })
 *   .end(function(err, res) {
 *     if (err) {
 *       return err;
 *     }
 *   });
 */

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
  it('should return ALL people on /people GET', function(done) {
    chai.request(server)
      .get('/people')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
  // it('should list a SINGLE person on /people/<id> GET');
})
