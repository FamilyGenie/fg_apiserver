var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

var importEvents = require('./event-import.js');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

var _data = [];

module.exports = function(PersonModel, StagedPersonModel, EventsModel, StagedEventsModel) {
    winston.log(logLevel, date + ': in people import')

    StagedPersonModel.find({},
      function(err, stagedPeople) {
        if (err) {
          res.status(500).send(err);
        }

        stagedPeople.forEach(function(stagedPerson) {

            PersonModel.findOne(
              // TODO find sweet spot for search function
              { $or: [{fName : stagedPerson.fName}, {lName : stagedPerson.lName}, {sexAtBirth : stagedPerson.sexAtBirth }] },
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
                  })
                } else {
                  object = {
                     fName: stagedPerson.fName,
                     lName: stagedPerson.lName,
                     sexAtBirth: stagedPerson.sexAtBirth,
                     notes: stagedPerson.notes,
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
                        importEvents(stagedPerson.personId, newPerson._id, EventsModel, StagedEventsModel)
                    })
                })
              }
            })
        })
      });
}
