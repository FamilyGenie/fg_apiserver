var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, ParentalRelTypeModel) {
  app.get('/api/v2/parentalreltypes', auth.isAuthenticated, function(req, res) {
    ParentalRelTypeModel.find(
      {},
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error getting all parentalRelTypes", err);
          return;
        }
        res.send(JSON.stringify(data));
      });
  });

  // todo: Is there more?
}
