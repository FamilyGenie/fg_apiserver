var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';

var date = new Date();

module.exports = function(app, ParentalRelTypeModel) {
  app.get('/api/v2/parentalreltypes', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in parentalreltypes get")
    ParentalRelTypeModel.find(
      {},
      function(err, data) {
        if(err) {
          res.status(500).send("Error getting all parentalRelTypes" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      });
  });
}
