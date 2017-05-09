var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';

var date = new Date();
mongoose.Promise = global.Promise;;


module.exports = function(app, UserLogModel) {

  // changed this so that you need to pass an object in the body. That object needs a 'field' and a 'value'. Made this mostly so that when we delete a person, we can remove all the pairbonds related to them
  app.post('/api/v2/logevent', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": In log people get");
    var user = req.decoded._doc.userName;
    var object = {
      action: req.body.object.action,
      logDate: date,
      user_id: user
    };
    new UserLogModel(object).save(function(err, data) {
      if (err) {
        res.status(500).send("Error creating log record for getPeople: " + err);
        return;
      }
      res.status(200).send(JSON.stringify(data));
    });
  });
}
