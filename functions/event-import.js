var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(app, PersonModel, EventsModel, StagedEventsModel) {
  winston.log(logLevel, date + ': in events import');

  StagedEventsModel.find({}, 
    function(err, stagedEvents) {
      if (err) {
        res.status(500).send(err);
      }

      EventsModel.find({},
        function(err, events) {
          if (err) {
            res.status(500).send(err);
          }

          stagedEvents.forEach(function(stagedEvent) {
            var match = false;
            
            events.forEach(function(event) {
              
              if (/*stagedEvent.eventDate === event.eventDate &&*/ stagedEvent.eventType === event.eventType && stagedEvent.eventPlace === event.eventPlace) { // might need to manipulate the dates to match? ...untested
                match = true;

                // search through the staged people on the ApId to find the genie_id, and put it on the event
                // set ignore to true
              }
            })

            if (match === false) {
              // search through the staged people on the ApId to find the genie_id, and put it on the event
              // set ignore to true
            }

          })
        })

    })
}

