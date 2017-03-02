var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, StagedPersonModel, PairBondRelModel, StagedPairBondRelModel) {
  winston.log(logLevel, date + ': in pairBondRel import');

  StagedPairBondRelModel.find({},
    function(err, stagedPairBondRels) {
      if (err) {
        callback(err)
      }

      async.each(stagedPairBondRels, function(stagedPairBondRel, callback) {

        // start by searching through the existing genie records, trying to find any that match the gedcom records according to the criteria. 
        PairBondRelModel.findOne(
          // we can also try implementing comparison based on ancestry_id. We want to make sure that the same two people in this record match the genie record.
          { $and: [ { relationshipType: stagedPairBondRel.relationshipType }, { startDate: stagedPairBondRel.startDate }, { endDate: stagedPairBondRel.endDate } ] },
          function(err, pairBondRel) {
            if (err) { 
              callback(err)
            }
            //
            // if a pairbond is found that exists in the genie records, update the gedcom record so that it can be reviewed later. 
            if (pairBondRel) {
              StagedPairBondRelModel.findOneAndUpdate(
                { _id : stagedPairBondRel._id },
                { $set : { ignore : false, genie_id : pairBondRel._id } },
                { new : true, upsert : true },
                function(err, data) {
                  if (err) {
                    callback(err)
                  }
                })
            }
            // otherwise we want to create a new genie record for the new pairbond.
            else {
              var person_one_id, person_two_id;

              // find the first person and save their _id to append to the new genie pairbond record
              StagedPersonModel.findOne(
                { personId : stagedPairBondRel.personOne_id },
                function(err, person) {
                  if(err) {
                    callback(err)
                  }
                  try {
                    person_one_id = person.genie_id;
                  }
                  catch (TypeError) {}
                  
                  StagedPersonModel.findOne(
                    { personId : stagedPairBondRel.personTwo_id },
                    function(err, person) {
                      if(err) {
                        callback(err)
                      }
                      try {
                        person_two_id = person.genie_id;
                      }
                      catch (TypeError) {}

                      if (person_one_id || person_two_id) {
                        // create a new record to save to the DB.
                        object = {
                          personOne_id: person_one_id || null,
                          personTwo_id: person_two_id || null,
                          relationshipType: stagedPairBondRel.relationshipType,
                          startDate: stagedPairBondRel.startDate,
                          endDate: stagedPairBondRel.endDate,
                          user_id: stagedPairBondRel.user_id,
                        }

                        // create a new pairbondrel based on the data from above
                        new PairBondRelModel(object).save(function(err, newPairBondRel) {
                          if (err) {
                            callback(err)
                          }

                          // update the staged pairbondrel to have the genie_id and ignore set to true so they don't appear in our duplicate review
                          StagedPairBondRelModel.findOneAndUpdate(
                            { _id : stagedPairBondRel._id },
                            { $set: { genie_id : newPairBondRel._id, ignore : true } },
                            { new : true, upsert : true },
                            function(err, data) {
                              if (err) {
                                callback(err)
                              }
                            })
                        })
                      }
                  })
              })
            }
            // call callback() once everything else has completed to send a success message back to the front end
            callback()
          })
      }, function(err) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send('success');
      })
    });
}

