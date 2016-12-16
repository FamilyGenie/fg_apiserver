var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, EventsModel) {
  app.get('/api/v2/events', auth.isAuthenticated, function(req, res) {
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    EventsModel.find(
      {
        user_id: user
      },
      function(err, data) {
        if (err) {
          res.status(500);
          res.send("Error getting all Events", err);
          return;
        }
        res.send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/events/update', auth.isAuthenticated, function(req, res) {
    EventsModel.findOneAndUpdate(
      {
        _id: _id,
        user_id: user
      },
      {$set: {
        person_id: req.body.object.person_id,
        type: req.body.object.type,
        eventDate: req.body.object.eventDate,
        place: req.body.object.place,
        details: req.body.object.details
      }},
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error updating event change", err);
          return;
        }
        res.send(data);
      }
    );
  });

  app.post('/api/v2/events/delete', auth.isAuthenticathed, function(req, res) {
    console.log("In events delete");
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    EventsModel.remove(
      {
        _id: req.body._id,
        user_id: user
      },
      function(err) {
        if (err) {
          rces.status(500);
          res.send("Error deleting events", err);
          return;
        }
        EventsModel.find(
          {
            user_id: user
          },
          function(err, data) {
            if(err) {
              res.status(500);
              res.send("Error getting all events after delete", err);
              return;
            }
            res.send(JSON.stringify(data));
          }
        );
      });
  });

  app.post('/api/v2/events/create', auth.isAuthenticated, function(req, res) {
    console.log("in events create");
    var user = req.decoded._doc.userName;
    object = {
      person_id: req.body.object.person_id,
      type: req.body.object.type,
      eventDate: req.body.object.eventDate,
      place: req.body.object.place,
      details: req.body.object.details,
      user_id: user
    };
    new EventsModel(object)(function(err, data) {
      if (err) {
        res.status(500);
        res.send("Error creating event", err);
        return;
      }
      res.send(JSON.stringify(data));
    });
  });
}
