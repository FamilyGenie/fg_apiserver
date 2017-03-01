var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app, StagedParentalRelModel) {
  app.get('/api/v2/staging/parentalrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in get staged parentalrels");
    var user = req.decoded._doc.userName;
    StagedParentalRelModel.find(
      { user_id: user },
      function(err, data) {
        if (err) {
          res.status(500).send("Error getting all staged parentalrels" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });
}
