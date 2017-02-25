var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, PersonModel, ParentalRelModel, StagedParentalRelModel) {
  winston.log(logLevel, date + ': in parentalRel import');
  
  StagedParentalRelModel.find({},
    function(err, stagedParentalRels) {
      if (err) {
        res.status(500).send(err);
      }

      // loop through the parental relationships.
      async.each(stagedParentalRels, function(stagedParentRel, callback) {
        ParentalRelModel.findOne(
          // TODO: find sweet spot for search function
          { $and: [ { relationshipType : stagedParentRel.relationshipType }, { startDate: stagedParentRel.startDate }, { endDate: stagedParentRel.endDate } ] },
          function(err, parentalRel) {
            if (err) {
              res.status(500).send(err);
            }
            // check if there is a match, if there is update the staged record. here we will set ignore to false so the record can be manually reviewed
            if (parentalRel) {
              StagedParentalRelModel.findOneAndUpdate(
                { _id : stagedParentRel._id },
                { $set : { ignore: false } },
                { new : true, upsert : true },
                function(err, data) {
                  if (err) {
                    res.status(500).send(err);
                  }
                  callback();
                })
            }
            else {
              // need to find the _ids of the parent and child as they exist in our records, to create the new parentalRelationship
              var child_id, parent_id;
              PersonModel.findOne(
                { ancestry_id : stagedParentRel.child_id },
                function(err, person) {
                  if(err) {
                    res.status(500).send(err);
                  }
                  try {
                    child_id = person._id;
                  }
                  catch (TypeError) {}

                  PersonModel.findOne(
                    { ancestry_id : stagedParentRel.parent_id },
                    function(err, person) {
                      if(err) {
                        res.status(500).send(err);
                      }
                      try {
                        parent_id = person._id;
                      }
                      catch (TypeError) {}

                      object = {
                        child_id: child_id || null,
                        parent_id: parent_id || null,
                        relationshipType: stagedParentRel.relationshipType,
                        subType: stagedParentRel.subType,
                        startDate: stagedParentRel.startDate,
                        endDate: stagedParentRel.endDate,
                        user_id: stagedParentRel.user_id,
                      }

                      new ParentalRelModel(object).save(function(err, newParentalRel) {
                        if (err) {
                          res.status(500).send(err);
                        }

                        StagedParentalRelModel.findOneAndUpdate(
                          { _id : stagedParentRel._id },
                          { $set: { genie_id : newParentalRel._id, ignore : true } },
                          { new : true, upsert: true },
                          function(err, data) {
                            if (err) {
                              res.status(500).send(err);
                            }
                            callback();
                          })
                      })
                  })
              })
            }
          })
      }, function(err) {
        if (err) {
          res.status(500).send(err);
        }
        // return something here to update store
        res.status(200).send('success');
      })
    });
}
