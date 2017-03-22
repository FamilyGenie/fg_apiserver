var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, user, StagedPersonModel, PairBondRelModel, StagedPairBondRelModel) {
  winston.log(logLevel, date + ': in pairBondRel import');

  StagedPairBondRelModel.find({ 'user_id' : user },
    function(err, stagedPairBondRels) {
      if (err) {
        res.status(500).send(err)
      }

      async.forEach(stagedPairBondRels, function(stagedPairBondRel, callback) {

        // start by searching through the existing genie records, trying to find any that match the gedcom records according to the criteria. 
        PairBondRelModel.findOne(
          // TODO: find a sweet spot for search function
          { $and: [ /* relationshipType will always be 'Marriage' */ { startDate: stagedPairBondRel.startDate }, { endDate: stagedPairBondRel.endDate }, { user_id: user } ] },
          function(err, pairBondRel) {
            if (err) { 
              callback(err)
            }
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
                  // we found a matching pairBondRel, so we updated the staged record with the genie_id, and we are done processing the record, so callback.
                  callback();
                })
            }
            // otherwise we want to create a new genie record for the new pairbond.
            else {
              var person_one_id, person_two_id;

              // find the first person and save their _id to append to the new genie pairbond record
              StagedPersonModel.findOne(
                { personId : stagedPairBondRel.personOne_id, user_id : user },
                function(err, person) {
                  if(err) {
                    callback(err)
                  }
                  try {
                    person_one_id = person.genie_id;
                  }
                  catch (TypeError) {} // the catch will happen if person object is empty, and we still want to continue, so do nothing
                  
                  StagedPersonModel.findOne(
                    { personId : stagedPairBondRel.personTwo_id, user_id : user },
                    function(err, person) {
                      if(err) {
                        callback(err)
                      }
                      try {
                        person_two_id = person.genie_id;
                      }
                      catch (TypeError) {} // the catch will happen if person object is empty, and we still want to continue, so do nothing

                      if (person_one_id || person_two_id) {
                        // create a new record to save to the DB.
                        object = {
                          personOne_id: person_one_id || null,
                          personTwo_id: person_two_id || null,
                          relationshipType: stagedPairBondRel.relationshipType,
                          startDate: stagedPairBondRel.startDate,
                          startDateUser: stagedPairBondRel.startDateUser,
                          endDate: stagedPairBondRel.endDate,
                          endDateUser: stagedPairBondRel.endDateUser,
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
                              // this is as far as we are going to go in processing this record, so callback to signify we are done.
                              callback();
                            })
                        })
                      } else {
                        // we didn't find person_one or person_two, so we are done processing this record, and can callback to signal we are done processing this record.
                        callback();
                      }
                  })
                })
              }
            })
          })
      }, function(err) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send('success');
      })
    });
}

