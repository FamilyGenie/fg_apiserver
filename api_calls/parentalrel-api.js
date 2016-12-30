var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, ParentalRelModel) {
  app.get('/api/v2/parentalrels', auth.isAuthenticated, function(req, res) {
    console.log("in get parentalrels");
    var user = req.decoded._doc.userName;
    ParentalRelModel.find(
      {
        user_id: user
      },
      function(err, data) {
        if(err) {
          res.status(500).send("Error getting all parental relationships" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/parentalrel/update', auth.isAuthenticated, function(req, res) {
    console.log("in parentalrel update");

    var _id = req.body.object._id;
    var user = req.decoded._doc.userName;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    ParentalRelModel.findOneAndUpdate(
      {
        _id: _id,
        user_id: user
      },
      {$set: set

      },
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500).send("Error updating parental relationship data" + err);
          return;
        }
        res.status(200).send(data);
      }
    );
  });

  app.post('/api/v2/parentalrel/delete', auth.isAuthenticated, function(req, res) {
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    ParentalRelModel.remove(
      {
        _id: _id,
        user_id: user
      },
      function(err, data) {
        if(err) {
          res.status(500).send("Error getting all parentalRels after delete" + err);
          return;
        }
        ParentalRelModel.find(
          {
            user_id: user
          }, // filter object - empty filter catches everything
          function(err, data) {
            if(err) {
              res.status(500);
              res.send("Error getting all parentalRels after delete" + err);
              return;
            }
            res.status(200).send(JSON.stringify(data));
          }
        );
      }
    );
  });

  app.post('/api/v2/parentalrel/create', auth.isAuthenticated, function(req, res) {
    console.log("in parentalrel create");
    var user = req.decoded._doc.userName;
    object = {
      child_id: req.body.object.child_id,
      parent_id: req.body.object.parent_id,
      relationshipType: req.body.object.relationshipType,
      subType: req.body.object.subType,
      startDate: req.body.object.startDate,
      endDate: req.body.object.endDate,
      user_id: user
    };

    new ParentalRelModel(object).save(function(err, data) {
      if(err) {
        res.status(500).send('Error creating new parentalrel: ' + err);
        return;
      }
      res.status(200).send(JSON.stringify(data));
    });
  });
}
