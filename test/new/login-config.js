module.exports = function(chai, chaiHttp, server, testUser) {
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
