var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, user, StagedPersonModel, StagedEventsModel, StagedParentalRelModel, StagedPairBondRelModel) {
  winston.log(logLevel, date + ': in clear all staged records');

  var success = true;

  StagedPersonModel.remove(
    {
      user_id : user
    }, 
    function(err, data) {
      if (err) {
        success = err;
        return;
      }
      return;
  })

  StagedEventsModel.remove(
    {
      user_id : user
    }, 
    function(err, data) {
      if (err) {
        success = err;
        return;
      }
      return;
  })

  StagedParentalRelModel.remove(
    {
      user_id : user 
    }, 
    function(err, data) {
      if (err) {
        success = err;
        return;
      }
      return;
  })

  StagedPairBondRelModel.remove(
    {
      user_id : user 
    }, 
    function(err, data) {
      if (err) {
        success = err;
        return;
      }
      return;
  })

  if (success === true) {
    res.status(200).send('success');
  } 
  else {
    res.status(500).send(success);
  }
}
