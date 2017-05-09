let auth = require('../authentication');
let mongoose = require('mongoose');
let winston = require('winston');
let moment = require('moment');

winston.level = 'debug'; // uncomment for development debugging
let logLevel = 'debug';
// var logLevel = 'info';

let date = new Date();
// let vDate = new moment();


module.exports = function(app, UserLogModel) {

  // changed this so that you need to pass an object in the body. That object needs a 'field' and a 'value'. Made this mostly so that when we delete a person, we can remove all the pairbonds related to them
  app.post('/api/v2/logevent', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": In log people get");
    let user = req.decoded._doc.userName;
    let object = {
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
