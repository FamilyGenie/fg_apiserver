var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, user, PersonModel, EventsModel, ParentalRelModel, PairBondRelModel) {
  winston.log(logLevel, date + ': in clear all staged records');

  async.parallel([
    function(callback) {
      console.log('removing people')
      PersonModel.remove(
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
      EventsModel.remove(
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
      ParentalRelModel.remove(
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
      PairBondRelModel.remove(
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
