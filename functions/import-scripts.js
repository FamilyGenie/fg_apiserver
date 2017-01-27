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

    require('./person-import')(PersonModel, StagedPersonModel)

    // These setTimeout functions are temporary to make this work synchronously until we come up with a better solution

    setTimeout(function() {
      require('./event-import')(PersonModel, StagedPersonModel, EventsModel, StagedEventsModel)
    }, 500)

    /*
     * setTimeout(function() {
     *   require('./parent-import')(PersonModel, StagedPersonModel, ParentalRelModel, StagedParentalRelModel)
     * }, 1000)
     */
    /*
     * setTimeout(function() {
     *   require('./pairbond-import')(PersonModel, StagedPersonModel, PairBondRelModel, StagedPairBondRelModel)
     * }, 1500)
     */


    res.status(200).send('success'); // need to find data to send back...
  })
}

