var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

// require models?
// require import-scripts?

module.exports = function(app, /* pass in all models or require them in this file?*/) {
  app.post('/api/v2/autoimport', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in autoimport")
    var user = req.decoded._doc.userName;

    // or require import-scripts here?
  })
}
