var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, PersonModel, PairBondRelModel, ParentalRelModel, ParentalRelTypeModel, PersonChangeModel, EventsModel) {
  app.get('api/v2/pairbondrels', auth.isAuthenticated, function(req,res) {
    var user = req.decoded._doc.userName;
    PairBondRelModel.find(
      {
        user_id: user
      }, // filter object empty - to return all
      function(err, data) {
        if(err) {
          res.status(500);
          res.send("Error getting all pairbonds", err);
          return;
        }
        res.send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/pairbondrels/update', auth.isAuthenticated, function(req,res) {
    console.log('in parbondrels update');
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    PairBondRelModel.findOneAndUpdate(
      {
        _id: id,
        user_id: user
      },
      {$set: {
        personOne_id: req.body.object.personOne_id,
        personTwo_id: req.body.object.personTwo_id,
        relationshipType: req.body.object.relationshipType,
        subType: req.body.object.subType,
        startDate: req.body.object.startDate,
        endDate: req.body.object.endDate,
        user_id: user
      }},
      {new: true},
      function(err, data) {
        if(err) {
          res.status(500);
        res.send("Error updating pair bond relationship data", err);\
        return;
        }
        res.send(data);
      }
    );
  })

  app.post('/api/v2/pairbondrels/delete', auth.isAuthenticated, function(req, res) {
    console.log("in person delete");
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    PairBondRelModel.remove(
      {
        _id: _id,
        user_id: user
      },
      function(err){
        if(err) {
          res.status(500);
          res.send("Error getting all pairBondRels after delete", err);
          return;
        }
        res.send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/pairbondrels/create', auth.isAuthenticated,
  function(req,res){
    console.log("in pairbondrel create");
    var user = req.decoded._doc.userName;
    object = {
      personOne_id: req.body.object.personOne_id,
      personTwo_id: req.body.object.personTwo_id,
      resationshipType: req.body.object.relationshipType,
      subType: req.body.object.subType,
      startDate: req.body.object.startDate,
      endDate: req.body.object.endDate,
      user_id: user
    },
    new PairBondRelModel(object).save(function(err, data) {
      if(err) {
        res.status(500);
        res.send("Error creating PairBondRel", err);
        return;
      }
      res.send(JSON.stringify(data));
    });
  });
  
}
