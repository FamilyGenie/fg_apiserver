var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, PersonModel, PairBondRelModel, StagedPairBondRelModel) {
  winston.log(logLevel, date + ': in pairBondRel import');

  StagedPairBondRelModel.find({},
    function(err, stagedPairBondRels) {
      if (err) {
        res.status(500).send(err);
      }

      async.each(stagedPairBondRels, function(stagedPairBondRel, callback) {

        // start by searching through the existing genie records, trying to find any that match the gedcom records according to the criteria. 
        PairBondRelModel.findOne(
          { $and: [ { relationshipType: stagedPairBondRel.relationshipType }, { startDate: stagedPairBondRel.startDate }, { endDate: stagedPairBondRel.endDate } ] },
          function(err, pairBondRel) {
            if (err) { 
              res.status(500).send(err);
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
                    res.status(500).send(err);
                  }
                })
            }
            // otherwise we want to create a new genie record for the new pairbond.
            else {
              var person_one_id, person_two_id;

              // find the first person and save their _id to append to the new genie pairbond record
              PersonModel.findOne(
                { ancestry_id : stagedPairBondRel.personOne_id },
                function(err, person) {
                  if (err) {
                    res.status(500).send(err);
                  }
                  // try/catch if there is no person record, it will throw a TypeError. 
                  try {
                    person_one_id = person._id;
                  }
                  catch (TypeError) {}

                  // search for the second persons _id. 
                  PersonModel.findOne(
                    { ancestry_id : stagedPairBondRel.personOne_id },
                    function(err, person) {
                      if (err) {
                        res.status(500).send(err);
                      }
                      // try/catch if there is no person record, it will throw a TypeError. 
                      try {
                        person_two_id = person._id;
                      }
                      catch (TypeError) {}

                      // create a new record to save to the DB.
                      object = {
                        personOne_id: person_one_id || null,
                        personTwo_id: person_two_id || null,
                        relationshipType: stagedPairBondRel.relationshipType,
                        startDate: stagedPairBondRel.startDate,
                        endDate: stagedPairBondRel.endDate,
                        user_id: stagedPairBondRel.user_id,
                      }

                      new PairBondRelModel(object).save(function(err, newPairBondRel) {
                        if (err) {
                          res.status(500).send(err);
                        }

                        StagedPairBondRelModel.findOneAndUpdate(
                          { _id : stagedPairBondRel._id },
                          { $set: { genie_id : newPairBondRel._id, ignore : true } },
                          { new : true, upsert : true },
                          function(err, data) {
                            if (err) {
                              res.status(500).send(err);
                            }
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
        res.status(200).send('success');
      })
    });
}

