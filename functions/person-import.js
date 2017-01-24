var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

var _data = [];

module.exports = function(app, PersonModel, StagedPersonModel) {
  app.post('/api/v2/autoimport', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-script')

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
                if (person.length) {
                  console.log('person', person[0].fName, stagedPerson.fName)
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
                  console.log('person not found', stagedPerson.fName);
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
    res.status(200).send('success') // want to send all data from above
  });
}
