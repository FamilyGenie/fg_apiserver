var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

// passing in the ancestry_id and genie_id makes this function smaller and more universal for importing events based on a single person. No need to search through the tables too many times.
module.exports = function(ancestry_id, genie_id, EventsModel, StagedEventsModel, functionCallback) {
  winston.log(logLevel, date + ': in events import');

  // find all events where the personId on the event matches the ancestry_id passed in from above.
  StagedEventsModel.find(
    { personId : ancestry_id },
    function(err, stagedEvents) {
      if (err) {
        res.status(500).send(err);
      }
      // if no events are found, an empty array is returned and nothing happens with the data
      async.each(stagedEvents, function(stagedEvent, callback){ 
        object = {
          person_id: genie_id,
          eventType: stagedEvent.eventType,
          eventDate: stagedEvent.eventDate,
          eventPlace: stagedEvent.eventPlace,
          approxDate: stagedEvent.approxDate,
          user_id: stagedEvent.user_id
        }
        // create a new event based on the information from the stagedEvent
        new EventsModel(object).save((err, newEvent) => {
          if (err) {
            res.status(500).send(err);
          }
          // update the original stagedEvent to have the newly created event's genie_id, and ignore set to true. This is so that the staged event no longer appears in the staged list
          StagedEventsModel.findOneAndUpdate(
            { _id : stagedEvent._id },
            { $set : { genie_id : newEvent._id, ignore : true } },
            { new : true, upsert : true },
            function(err, updatedEvent) {
              if (err) {
                res.status(500).send(err);
              }
              callback();
            }
          )
        })
      }, function(err) {
           if (err) {
             res.status(500).send(err);
           }
           else {
             // should probably return something here
             functionCallback();
           }
        }
      ) 
    }
  )
}

