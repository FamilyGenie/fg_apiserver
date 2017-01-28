var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app, PersonModel, EventsModel, ParentalRelModel) {
  app.post('/api/v2/newperson/create', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in newperson create");

    var user = req.decoded._doc.userName;

    var personObject = {
        fName: '',
        mName: '',  
        lName: '',
        sexAtBirth: '',
        birthDate: '',
        birthPlace: '',
        deathDate: '',
        deathPlace: '',
        notes: '',
        user_id: user
      };

      new PersonModel(personObject).save(function(err, data) {
        if (err) {
          res.status(500).send("Error creating new parent")
        }
        var newFather = data;

      new PersonModel(personObject).save(function(err, data) {
      if (err) {
          res.status(500).send("Error creating new parent")
        }
        var newMother = data;

      new PersonModel(personObject).save(function(err, data) {
        if (err) {
          res.status(500).send("Error creating new child" + err);
          return;
        }

        var newChild = data;

        eventObject = {
          person_id : newChild._id,
          eventType : 'Birth',
          eventdateUser: '',
          eventDate: null,
          eventPlace: '',
          familyContext: '',
          localContext: '',
          worldContext: '',
          user_id: user
        }
        
        new EventsModel(eventObject).save(function(err, data) {
          if (err) {
            res.status(500).send("Error creating New Person Birth" + err);
            return;
          }

          var newEvent = data;

          motherObject = {
            child_id: newChild._id,
            parent_id: newMother._id,
            relationshipType: 'Mother',
            subType: 'Biological',
            startDateUser: '',
            startDate: null,
            endDateUser: '',
            endDate: null,
            user_id: user
          };

          new ParentalRelModel(motherObject).save(function(err,data) {
            if (err) {
              res.status(500).send("Error creating new mother rel");
              return;
            }

            var newMotherRel = data;

            fatherObject = {
              child_id: newChild._id,
              parent_id: newFather._id,
              relationshipType: 'Father',
              subType: 'Biological',
              startDateUser: '',
              startDate: null,
              endDateUser: '',
              endDate: null,
              user_id: user
            };

            new ParentalRelModel(fatherObject).save(function(err,data) {
              if (err) {
                res.status(500).send("Error creating new father rel");
                return;
              }

                var newFatherRel = data;

                result = {
                  newChild,
                  newFather,
                  newMother,
                  newEvent,
                  newMotherRel,
                  newFatherRel
                }

                res.status(200).send(result);
              })
            })
          })
        })
      })
    })
  })
}
