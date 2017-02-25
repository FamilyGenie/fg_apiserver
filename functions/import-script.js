var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var async = require('async');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(app, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel, ParentalRelModel, StagedParentalRelModel, PairBondRelModel, StagedPairBondRelModel) {
  app.post('/api/v2/autoimport', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts');

    require('./person-import')(res, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel)
  });

  app.post('/api/v2/autoimportrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts')

    // require('./parentalrel-import')(res, PersonModel, ParentalRelModel, StagedParentalRelModel)
    require('./pairbondrel-import')(res, PersonModel, PairBondRelModel, StagedPairBondRelModel)

  })
}

