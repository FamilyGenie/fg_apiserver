var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, user, StagedPersonModel, ParentalRelModel, StagedParentalRelModel) {
  winston.log(logLevel, date + ': in parentalRel import');
  
  StagedParentalRelModel.find({ 'user_id' : user },
    function(err, stagedParentalRels) {
      if (err) {
        res.status(500).send(err)
      }

      // loop through the parental relationships.
      // async.each will execute the anonymous function for every record in stagedEvents. The anonymous function will be executed for each record until callback() is run. Once callback() is run for each record, the function that is the third argument to the async.each call is run. If callback is run with a non-null value as a parameter, then that is signal there was an error.
      async.each(stagedParentalRels, function(stagedParentRel, callback) {
        ParentalRelModel.findOne(
          // TODO: find sweet spot for search function
          { $and: [ { relationshipType : stagedParentRel.relationshipType }, { startDate: stagedParentRel.startDate }, { endDate: stagedParentRel.endDate }, { user_id: user } ] },
          function(err, parentalRel) {
            if (err) {
              callback(err)
            }
            // check if there is a match, if there is update the staged parentalrel record. here we will set ignore to false so the record can be manually reviewed
            if (parentalRel) {
              StagedParentalRelModel.findOneAndUpdate(
                { _id : stagedParentRel._id },
                { $set : { genie_id: parentalRel._id, ignore: false } },
                { new : true, upsert : true },
                function(err, data) {
                  if (err) {
                    callback(err)
                  }
                  // we found a matching parentalRel, so we updated the staged record with the genie_id, and we are done processing the record, so callback.
                  callback()
                })
            }
            else {
              // need to find the _ids of the parent and child as they exist in our records, to create the new parentalRelationship
              var child_id, parent_id;
              StagedPersonModel.findOne(
                { personId : stagedParentRel.child_id, user_id : user },
                function(err, person) {
                  if(err) {
                    callback(err)
                  }
                  try {
                    child_id = person.genie_id;
                  }
                  catch (TypeError) {}

                  StagedPersonModel.findOne(
                    { personId : stagedParentRel.parent_id, user_id : user },
                    function(err, person) {
                      if(err) {
                        callback(err)
                      }
                      try {
                        parent_id = person.genie_id;
                      }
                      catch (TypeError) {}

                      if (child_id || parent_id) {
                        object = {
                          child_id: child_id || null,
                          parent_id: parent_id || null,
                          relationshipType: stagedParentRel.relationshipType,
                          subType: stagedParentRel.subType,
                          startDate: stagedParentRel.startDate,
                          startDateUser: stagedParentRel.startDateUser,
                          endDate: stagedParentRel.endDate,
                          endDateUser: stagedParentRel.endDateUser,
                          user_id: stagedParentRel.user_id,
                        }

                        // create the new parental relationship record from the data provided above
                        new ParentalRelModel(object).save(function(err, newParentalRel) {
                          if (err) {
                            callback(err)
                          }

                          // updated the staged parentalrel to have the new genie_id and ignore set to true so that they don't appear in our duplicate review
                          StagedParentalRelModel.findOneAndUpdate(
                            { _id : stagedParentRel._id },
                            { $set: { genie_id : newParentalRel._id, ignore : true } },
                            { new : true, upsert: true },
                            function(err, data) {
                              if (err) {
                                callback(err)
                              }
                              // this is as far as we are going to go in processing this record, so callback to signify we are done.
                              callback();
                            })
                        })
                      } else {
                        // we didn't find child or parent, so we are done processing this record, and can callback to signal we are done processing this record.
                        callback()
                      }
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
