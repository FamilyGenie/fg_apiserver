var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(PersonModel, StagedPersonModel, EventsModel, StagedEventsModel) {
  winston.log(logLevel, date + ': in events import');

  // find people that have been imported from gedcom into FG to get their genie_id.
  // :returns: an array of people with a genie_id field
  StagedPersonModel.find(
    { genie_id : { $exists : true } },
    function(err, stagedPeople) {
      if (err) {
        res.status(500).send(err);
      }
      stagedPeople.forEach((stagedPerson) => {
        // find events that match each person. 
        // :returns: an array of events
        StagedEventsModel.find(
          { personId : stagedPerson.personId },
          function(err, stagedEvents) {
            if (err) {
              res.status(500).send(err);
            }
            // create/import a new event from the information from the stagedEvent
            stagedEvents.forEach((stagedEvent) => {
              var object = {
                person_id: stagedPerson.genie_id,
                eventType: stagedEvent.eventType,
                eventDate: stagedEvent.eventDate,
                eventPlace: stagedEvent.eventPlace,
                approxDate: stagedEvent.approxDate
              }
              new EventsModel(object).save((err, newEvent) => {
                if (err) {
                  res.status(500).send(err);
                }
                // should return something here... TODO
                console.log('newEvent', newEvent)
              })
            })
          }
        )
      })
    }
  )
}

