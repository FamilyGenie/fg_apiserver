var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(app, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel, ParentalRelModel, StagedParentalRelModel, PairBondRelModel, StagedPairBondRelModel) {

  // for each of these functions we are passing in the required model information, as well as the `res` and the `user`. This allows for responses to be sent from within the scripts.
   
  // auto-import of people and events. Events are imported for each person, called within the function.
  app.post('/api/v2/autoimportpeople', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts');

    require('./person-import')(res, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel)
  });

  app.post('/api/v2/autoimportparentalrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts')

    require('./parentalrel-import')(res, StagedPersonModel, ParentalRelModel, StagedParentalRelModel)
  })

  app.post('/api/v2/autoimportpairbondrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts')

    require('./pairbondrel-import')(res, StagedPersonModel, PairBondRelModel, StagedPairBondRelModel)
  })

  app.post('/api/v2/clearstagedrecords', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts')
    
    var user = req.decoded._doc.userName;
    require('./clear-staged-records')(res, user, StagedPersonModel, StagedEventsModel, StagedParentalRelModel, StagedPairBondRelModel)
  })

  app.post('/api/v2/clearsavedrecords', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts')
    
    var user = req.decoded._doc.userName;
    require('./clear-saved-records')(res, user, PersonModel, EventsModel, ParentalRelModel, PairBondRelModel)
  })
}

