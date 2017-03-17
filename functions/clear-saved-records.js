var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(res, user, PersonModel, EventsModel, ParentalRelModel, PairBondRelModel) {
  winston.log(logLevel, date + ': in clear all staged records');

  var success = true;

  PersonModel.remove(
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

  EventsModel.remove(
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

  ParentalRelModel.remove(
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

  PairBondRelModel.remove(
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
