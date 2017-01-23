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

        PersonModel.find({},
          function(err, people) {
            if (err) {
              res.status(500).send(err);
            }

            stagedPeople.forEach(function(stagedPerson) {
              var match = false;
              people.forEach(function(person) {

                if (stagedPerson.fName === person.fName && stagedPerson.lName === person.lName && stagedPerson.sexAtBirth === person.sexAtBirth) {
                  match = true;

                  StagedPersonModel.findOneAndUpdate(
                    { _id : stagedPerson._id },
                    { $set : { genie_id : person._id, ignore : true } },
                    { new : true, upsert: true },
                    function(err, data1) {
                      if (err) {
                        res.status(500).send(err);
                      }
                      // want to return data1
                  })
                }

              })

              if (match === false) {
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
                    { new : true, upsert : true },
                    function(err, data2) {
                      if (err) {
                        res.status(500).send(err)
                      }
                      // want to retrn data2
                  })
                  // want to return newPerson
                })
              }

            })
        });
      });
    res.status(200).send('success ' + _data) // want to send all data from above
  });
}
