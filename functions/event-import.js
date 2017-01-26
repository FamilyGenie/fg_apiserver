var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(PersonModel, StagedPersonModel, EventsModel, StagedEventsModel) {
  winston.log(logLevel, date + ': in events import');

  StagedEventsModel.find({}, 
    function(err, stagedEvents) {
      if (err) {
        res.status(500).send(err);
      }
      console.log(stagedEvents)
    })
}

