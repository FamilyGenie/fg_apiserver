var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

var importEvents = require('./event-import.js');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

var _data = [];

module.exports = function(res, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel) {
    winston.log(logLevel, date + ': in people import')

    StagedPersonModel.find({},
      function(err, stagedPeople) {
        if (err) {
          res.status(500).send(err);
        }

        // async.each will execute the anonymous function for every record in stagedEvents. The anonymous function will be executed for each record until callback() is run. Once callback() is run for each record, the function that is the third argument to the async.each call is run. If callback is run with a non-null value as a parameter, then that is signal there was an error.
        async.each(stagedPeople, function(stagedPerson, callback) {

            PersonModel.findOne(
              // TODO find sweet spot for search function
              { $or: [{fName : stagedPerson.fName}, {lName : stagedPerson.lName}, {sexAtBirth : stagedPerson.sexAtBirth }] },
              function(err, person) {
                if (err) {
                  res.status(500).send(err);
                  // TODO: I think we want a callback here with an error, rather than a res.send. Calling callback with a non-null value let's the async.each function know that there was an error processing the record. That can then be handled in the function below that is run when all records are processed.
                // callback(err);
                }
                // check if there is a person found that matches the staged person. If so, set ignore to false so the stagedPerson can be manually reviewed by the customer.
                if (person) {
                  StagedPersonModel.findOneAndUpdate(
                    { _id : stagedPerson._id },
                    { $set : { ignore : false } },
                    { new : true, upsert: true },
                    function(err, data1) {
                      if (err) {
                        res.status(500).send(err);
                        // TODO: I think we want a callback here with an error, rather than a res.send. Calling callback with a non-null value let's the async.each function know that there was an error processing the record. That can then be handled in the function below that is run when all records are processed.
                        // callback(err);
                      }
                      // this is what we want to have happen, and we are done processing this record, so call the callback with a null value to indicate success.
                      callback();
                  })
                } else {
                  // when we do not find the staged person in the people records, we create a new person
                  object = {
                     fName: stagedPerson.fName,
                     lName: stagedPerson.lName,
                     sexAtBirth: stagedPerson.sexAtBirth,
                     notes: stagedPerson.notes,
                     user_id: stagedPerson.user_id,
                  }

                  new PersonModel(object).save(function(err, newPerson) {
                    if (err) {
                      res.status(500).send(err);
                      // TODO: I think we want a callback here with an error, rather than a res.send. Calling callback with a non-null value let's the async.each function know that there was an error processing the record. That can then be handled in the function below that is run when all records are processed.
                      // callback(err);
                    }
                    // after the new person is created we update the staged person record to include the genie_id and set ignore to true because we will not need to review this record
                    StagedPersonModel.findOneAndUpdate(
                      { _id : stagedPerson._id },
                      { $set : { genie_id : newPerson._id, ignore : true } },
                      { new : true, upsert: true },
                      function(err, data1) {
                        if (err) {
                          res.status(500).send(err);
                          // TODO: I think we want a callback here with an error, rather than a res.send. Calling callback with a non-null value let's the async.each function know that there was an error processing the record. That can then be handled in the function below that is run when all records are processed.
                          // callback(err);
                        }
                        // A new person has been imported into the Genie People collection. Call importEvents to import all the events from the stagedEvents collection to the Events collection. As a last parameter, send a callback, which is the callback() that the async.each looks for to signify that this record is done being processed).
                        importEvents(stagedPerson.personId, newPerson._id, EventsModel, StagedEventsModel, function() { callback() })
                    })
                })
              }
            })
        }, function(err) {
          if (err) {
            res.status(500).send(err);
            // I believe this is the only place in the code that we actually send the err back to the client. Everywhere else the error occurs, we can propogate it until we get to here.
          }
          else {
            // need to return something here, but for now, the client must do a fetch on the following collection once the cient receives a response: Events, StagedPerson, StagedEvents
            res.status(200).send('success');
          }
        })
      });
}
