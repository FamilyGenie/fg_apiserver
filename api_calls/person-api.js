var auth = require('../authentication');
var mongoose = require('mongoose');

module.exports = function(app, PersonModel, PairBondRelModel, ParentalRelModel, ParentalRelTypeModel, PersonChangeModel, EventsModel) {
	app.get('/api/v2/people', auth.isAuthenticated, function(req, res) {
		var user = req.decoded._doc.userName;
		PersonModel.find(
			{
				user_id: user
			}, // filter object empty - to return all
			function(err, data) {
				if(err) {
					res.status(500);
					res.send("Error getting all people");
					return;
				}
				// console.log("Results from get.people:", JSON.stringify(data));
				res.send(JSON.stringify(data));
			}
		);
	});

	app.post('/api/v2/update', auth.isAuthenticated, function(req, res) {
		console.log("in update with:", req.body.objectType);
		var id = req.body.object._id;
		var user = req.decoded._doc.userName;
		const set = {};
		set[req.body.object.field] = req.body.object.value;
		PersonModel.findOneAndUpdate(
			{
				_id: id,
				user_id: user
			},
			{$set: set
				// todo: validate the heck out of this. make sure it is not _id that we are updating, at a min
			},
			{new: true},
			function(err, data) {
				if(err) {
					res.status(500);
					res.send("Error updating person data");
					return;
				}
				console.log("****Updated record being returned", data);
				res.send(data);
			}
		);
	})
}
