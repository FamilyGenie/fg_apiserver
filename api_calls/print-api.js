var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');
var pdf = require('html-pdf')

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app) {
/*
 *   app.get('/api/v2/familymap/pdf', auth.isAuthenticated, function(req,res) {
 * 
 *     winston.log(logLevel, date + ": in display family map");
 * 
 *   })
 */

  app.post('/api/v2/print/map', auth.isAuthenticated, function(req, res) {

    winston.log(logLevel, date + ": in print family map");

    console.log(req.body);

    pdf.create(req.body.htmlString).toFile(__dirname + '../uploads/maps/' + req.body.star_id + '.pdf', function(err, res){
      if (err) return console.log('Error creating PDF ' + err);
      console.log(res)
    }); 

  })
} 
