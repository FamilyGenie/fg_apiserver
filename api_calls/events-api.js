var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';

var date = new Date();

module.exports = function(app, EventsModel) {
  app.get('/api/v2/events', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in events get")
    var user = req.decoded._doc.userName;
    EventsModel.find(
      {
        user_id: user
      },
      function(err, data) {
        if (err) {
          res.status(500).send("Error getting all Events" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/event/update', auth.isAuthenticated, function(req, res) {
    // this console.log is meant to be here - to keep a log of activities in the node server log
    winston.log(logLevel, date + ": in events update");
    // passport inserts the user into req.decoded._doc.userName
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    EventsModel.findOneAndUpdate(
      {
        _id: _id,
        user_id: user
      },
      {$set: set
        // todo: validate the heck out of this. make sure it is not _id that we are updating, at a min
      },
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500).send("Error updating event change" + err);
          return;
        }
        res.status(200).send(data);
      }
    );
  });

  // changed this so that you need to pass an object in the body. That object needs a 'field' and a 'value'. Made this mostly so that when we delete a person, we can remove all the pairbonds related to them
  app.post('/api/v2/event/delete', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": In event delete with: " + req.body.object.field + " " + req.body.object.value);
    var user = req.decoded._doc.userName;
    EventsModel.remove(
      {
        [req.body.object.field]: req.body.object.value,
        user_id: user
      },
      function(err) {
        if (err) {
          res.status(500).send("Error deleting events" + err);
          return;
        }
        EventsModel.find(
          {
            user_id: user
          },
          function(err, data) {
            if(err) {
              res.status(500).send("Error getting all events after delete" + err);
              return;
            }
            res.status(200).send(data);
          }
        );
      });
  });


  app.post('/api/v2/event/create', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in event create");

    var user = req.decoded._doc.userName;
    object = {
      person_id: req.body.object.person_id,
      eventType: req.body.object.eventType,
      eventDate: req.body.object.eventDate,
      eventPlace: req.body.object.eventPlace,
      details: req.body.object.details,
      user_id: user
    };
    new EventsModel(object).save(function(err, data) {
      if (err) {
        res.status(500).send("Error creating event" + err);
        return;
      }
      res.status(200).send(JSON.stringify(data));
    });
  });
}
