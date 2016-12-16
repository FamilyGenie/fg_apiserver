var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, PersonChangeModel) {
  app.get('/api/v2/peoplechanges', auth.isAuthenticated, function(req, res) {
    var user = req.decoded._doc.userName;
    PersonChangeModel.find(
      {
        user_id: user
      }, // filter object empty - to return all
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error getting all personChanges", err);
          return;
        }
        // console.log("Results from get.personChanges:", JSON.stringify(data));
        res.send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/peoplechanges/update', auth.isAuthenticated, function(req, res) {
    PersonChangeModel.findOneAndUpdate(
      {
        _id: id,
        user_id: user
      },
      {$set: {
      person_id: req.body.object.person_id,
      dateChange: req.body.object.dateChange,
      fName : req.body.object.fName,
      mName: req.body.object.mName,
      lName: req.body.object.lName,
      sex: req.body.object.sex,
      user_id: user
      }},
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error updating person change data", err);
          return;
        }
        res.send(data);
      }
    );
  });

  app.post('/api/v2/peoplechanges/delete', auth.isAuthenticathed, function(req, res) {
    PersonChangeModel.remove(
      {
        _id: req.body._id,
        user_id: user
      },
      function(err) {
        if (err) {
          res.status(500);
          res.send("Error deleting personChange", err);
          return;
        }
        PersonChangeModel.find(
          {
            user_id: user
          }, // filter object - empty filter catches everything
          function(err, data) {
            if(err) {
              res.status(500);
              res.send("Error getting all pairBondRels after delete", err);
              return;
            }
            res.send(JSON.stringify(data));
          }
        );
      }
    );
  });

  app.post('/api/v2/peoplechanges/create', auth.isAuthenticated, function(req, res) {
    object = {
      person_id: req.body.object.person_id,
      dateChange: req.body.object.dateChange,
      fName : req.body.object.fName,
      mName: req.body.object.mName,
      lName: req.body.object.lName,
      sex: req.body.object.sexAtBirth,
      user_id: user
    };
    new PersonChangeModel(object).save(function(err, data){
      if (err) {
        console.log("Create PersonChange error:", err);
        res.status(500);
        res.send("Error creating line item");
        return;
      }
      res.send(JSON.stringify(data));
    });
  });
}
