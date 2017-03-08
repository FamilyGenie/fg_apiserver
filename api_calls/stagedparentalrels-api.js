var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app, StagedParentalRelModel) {
  app.get('/api/v2/staging/parentalrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in get staged parentalrels");
    var user = req.decoded._doc.userName;
    StagedParentalRelModel.find(
      { user_id: user },
      function(err, data) {
        if (err) {
          res.status(500).send("Error getting all staged parentalrels" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  });

  app.post('/api/v2/staging/parentalrel/update', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in update staged parentalrels");
    var user = req.decoded._doc.userName;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    StagedParentalRelModel.findOneAndUpdate(
      {
        _id: req.body.object._id,
        user_id: user
      },
      { $set : set },
      { new : true },
      function(err, data) {
        if(err) {
          res.status(500).send('error updating staged parentalrelationship' + err)
        }
        res.status(200).send(data);
      })
  })
}
