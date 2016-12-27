var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, EventsModel) {
  app.get('/api/v2/events', auth.isAuthenticated, function(req, res) {
    var user = req.decoded._doc.userName;
    EventsModel.find(
      {
        user_id: user
      },
      function(err, data) {
        if (err) {
          res.status(500).send("Error getting all Events", err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/event/update', auth.isAuthenticated, function(req, res) {
    // this console.log is meant to be here - to keep a log of activities in the node server log
    console.log("in events update");
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
          res.status(500).send("Error updating event change", err);
          return;
        }
        res.status(200).send(data);
      }
    );
  });

  app.post('/api/v2/event/delete', auth.isAuthenticated, function(req, res) {
    console.log("In event delete");
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    EventsModel.remove(
      {
        _id: _id,
        user_id: user
      },
      function(err) {
        if (err) {
          res.status(500).send("Error deleting events", err);
          return;
        }
        EventsModel.find(
          {
            user_id: user
          },
          function(err, data) {
            if(err) {
              res.status(500).send("Error getting all events after delete", err);
              return;
            }
            res.status(200).send(JSON.stringify(data));
          }
        );
      });
  });


  app.post('/api/v2/event/create', auth.isAuthenticated, function(req, res) {
    console.log("in event create");
    var user = req.decoded._doc.userName;
    object = {
      person_id: req.body.object.person_id,
      type: req.body.object.type,
      eventDate: req.body.object.eventDate,
      place: req.body.object.place,
      details: req.body.object.details,
      user_id: user
    };
    new EventsModel(object).save(function(err, data) {
      if (err) {
        res.status(500).send("Error creating event", err);
        return;
      }
      res.status(200).send(JSON.stringify(data));
    });
  });
}
