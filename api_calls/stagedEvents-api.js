var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app, StagedEventModel) {
  app.get('/api/v2/staging/events', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in get staged events");
    var user = req.decoded._doc.userName;
    StagedEventModel.find(
      { user_id: user },
      function(err, data) {
        if (err) {
          winston.log(logLevel, date + ': staged event find error')
          res.status(500).send("Error getting all staged events" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });
}
