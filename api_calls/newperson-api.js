var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

// create a blank person, blank birth event, and two blank paretal relationships
// all people have been born from two biological parents
module.exports = function(app, PersonModel, EventsModel, ParentalRelModel) {
  app.post('/api/v2/newperson/create', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in newperson create");

    var user = req.decoded._doc.userName;

    // declare a blank person, including the user_id
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
      var newChild = data;

      // declare a blank event for birth using the id of the newly created person from above
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
          parent_id: '',
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

              // send the information back to the front end to update there
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
}
