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

        async.each(stagedPeople, function(stagedPerson, callback) {

            PersonModel.findOne(
              // TODO find sweet spot for search function
              // changed back from (fName & lName | birthDate), this is more efficient, could still use work. 
              { $and: [ { fName : stagedPerson.fName }, { lName : stagedPerson.lName }, { birthDate : stagedPerson.birthDate } ] },
              function(err, person) {
                if (err) {
                  res.status(500).send(err);
                }
                // check if there is a person found that matches the staged person, and update the staged record if one is found. Here we set ignore to false so the stagedPerson can be manually reviewed. 
                if (person) {
                  StagedPersonModel.findOneAndUpdate(
                    { _id : stagedPerson._id },
                    { $set : { ignore : false } },
                    { new : true, upsert: true },
                    function(err, data1) {
                      if (err) {
                        res.status(500).send(err);
                      }
                      // don't need to call callback() until importEvents is finished
                  })
                  // if a stagedPerson is not imported because it matches the criteria, we need to store a reference to the staged person on the existing record to help match for relationships
                  PersonModel.findOneAndUpdate(
                    { _id : person._id },
                    { $set: { ancestry_id : stagedPerson.personId } },
                    { new : true, upsert : true },
                    function(err, data) {
                      if (err) {
                        res.status(500).send(err);
                      }
                      // don't need to call callback() until importEvents is finished
                    }
                  )
                } else {
                  object = {
                     fName: stagedPerson.fName,
                     lName: stagedPerson.lName,
                     sexAtBirth: stagedPerson.sexAtBirth,
                     notes: stagedPerson.notes,
                     ancestry_id: stagedPerson.personId,
                     user_id: stagedPerson.user_id,
                  }

                  // when we do not find the staged person in the people records, we create a new person
                  new PersonModel(object).save(function(err, newPerson) {
                    if (err) {
                      res.status(500).send(err);
                    }
                    // after the new person is created we update the staged person record to include the genie_id and set ignore to true because we will not need to review this record
                    StagedPersonModel.findOneAndUpdate(
                      { _id : stagedPerson._id },
                      { $set : { genie_id : newPerson._id, ignore : true } },
                      { new : true, upsert: true },
                      function(err, data1) {
                        if (err) {
                          res.status(500).send(err);
                        }
                        importEvents(stagedPerson.personId, newPerson._id, EventsModel, StagedEventsModel, function() { callback() })
                    })
                })
              }
            })
        }, function(err) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            // need to return something here
            res.status(200).send('success');
          }
        })
      });
}
