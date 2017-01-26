var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

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

            PersonModel.find(
              { fName : stagedPerson.fName, lName : stagedPerson.lName, sexAtBirth : stagedPerson.sexAtBirth },
              function(err, person) {
                if (err) {
                  res.status(500).send(err);
                }
                if (!person.length) {
                  StagedPersonModel.findOneAndUpdate(
                    { _id : stagedPerson._id },
                    { $set : { genie_id : person[0]._id, ignore : true } },
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

                  new PersonModel(object).save(function(err, newPerson) {
                    if (err) {
                      res.status(500).send(err);
                    }
                    console.log('created new person')
                    StagedPersonModel.findOneAndUpdate(
                      { _id : stagedPerson._id },
                      { $set : { genie_id : newPerson._id, ignore : true } },
                      { new : true, upsert: true },
                      function(err, data1) {
                        if (err) {
                          res.status(500).send(err);
                        }
                    })
                })
              }
            })

        })
      });
}
