// Person Get, Update is in
var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug'; // uncomment for development debugging
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

// deprecation fix for mpromise (mongoose's default promise library)
mongoose.Promise = global.Promise;

module.exports = function(app, StagedPersonModel) {
	app.get('/api/v2/staging/people', auth.isAuthenticated, function(req, res) {
		// this console.log is meant to be here - to keep a log of activities in the node server log
		winston.log(logLevel, date + ": in get staged people ");
		var user = req.decoded._doc.userName;
		StagedPersonModel.find(
			{
				user_id: user
			}, // filter object empty - to return all
			function(err, data) {
				if(err) {
					res.status(500).send("Error getting all staged people" + err);
					return;
				}
				res.status(200).send(JSON.stringify(data));
			}
		);
	});

  app.post('/api/v2/staging/person/update', auth.isAuthenticated, function(req,res) {
    winston.log(logLevel, date + ": in update staged person");
    var user = req.decoded._doc.userName;
    var _id = req.body.object._id;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    StagedPersonModel.findOneAndUpdate(
      { _id : _id, user_id : user },
      { $set : set },
      { new : true },
      function(err, data) {
        if (err) {
          res.status(500).send("Error updating staged person" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    );
  })
}
