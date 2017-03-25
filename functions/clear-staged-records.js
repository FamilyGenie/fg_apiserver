var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, user, StagedPersonModel, StagedEventsModel, StagedParentalRelModel, StagedPairBondRelModel) {
  winston.log(logLevel, date + ': in clear all staged records');

  async.parallel([
    function(callback) {
      console.log('removing people')
      StagedPersonModel.remove(
        {
          user_id : user
        }, 
        function(err, data) {
          if (err) {
            callback(err);
          }
          callback();
      })
    }, function(callback) {
      console.log('removing events')
      StagedEventsModel.remove(
        {
          user_id : user
        }, 
        function(err, data) {
          if (err) {
            callback(err);
          }
          callback();
      })
    }, function(callback) {
      console.log('removing parents')
      StagedParentalRelModel.remove(
        {
          user_id : user 
        }, 
        function(err, data) {
          if (err) {
            callback(err);
          }
          callback();
      })
    }, function(callback) {
      console.log('removing pairbonds')
      StagedPairBondRelModel.remove(
        {
          user_id : user 
        }, 
        function(err, data) {
          if (err) {
            callback(err);
          }
          callback();
      })
    }
  ], function done(err, results) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send('success');
  })
  // async.parallel, run all remove functions and then respond to the front end


}
