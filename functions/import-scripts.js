var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

module.exports = function(app, PersonModel, StagedPersonModel, EventsModel, StagedEventsModel) {
  app.post('/api/v2/autoimport', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ': in import-scripts');

    // require('./person-import')(PersonModel, StagedPersonModel);
    require('./event-import')(PersonModel, StagedPersonModel, EventsModel, StagedEventsModel)
    res.status(200).send('success'); // need to find data to send back...
  })
}

