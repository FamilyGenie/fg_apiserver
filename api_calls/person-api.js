// Person Get, Update is in
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
				// return all people
				res.send(JSON.stringify(data));
			}
		);
	});

	app.post('/api/v2/person/update', auth.isAuthenticated, function(req, res) {
		var _id = req.body.object._id;
		var user = req.decoded._doc.userName;
		const set = {};
		set[req.body.object.field] = req.body.object.value;
		PersonModel.findOneAndUpdate(
			{
				_id: _id,
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
				// return the updated person object
				res.send(data);
			}
		);
	})

	app.post('/api/v2/person/delete', auth.isAuthenticated, function(req, res) {
		console.log("in person delete");
		var _id = req.body.object._id;
		var user = req.decoded._doc.userName;
		const set = {};
		set[req.body.object.field] = req.body.object.value;
		PersonModel.remove(
			{
				_id: _id,
			user_id: user
			},
			function(err) {
				if (err) {
					res.status(500);
					// got this error when calling delete on a person:
					// express deprecated res.send(status, body): Use res.status(status).send(body) instead
					res.send("Error deleting person", err);
					return;
				}
				PersonModel.find(
				{
					user_id: user
				}, // filter object - empty filter catches everything
				function(err, data) {
					if(err) {
						res.status(500);
						res.send("Error getting all persons after delete", err);
						return;
					}
					// return the full array of all people. Can we send just success, and then on the client side, just remove the deleted person?
					res.send(JSON.stringify(data));
				}
			);
		});
	})

	app.post('/api/v2/person/create', auth.isAuthenticated, function(req, res) {
		console.log("in person create");
		var user = req.decoded._doc.userName;
		// var _id = req.body.object._id;
		// const set = {};
		// set[req.body.object.field] = req.body.object.value;
		object = {
				fName : req.body.object.fName,
				mName: req.body.object.mName,
				lName: req.body.object.lName,
				sexAtBirth: req.body.object.sexAtBirth,
				birthDate: req.body.object.birthDate,
				birthPlace: req.body.object.birthPlace,
				deathDate: req.body.object.deathDate,
				deathPlace: req.body.object.deathPlace,
				notes: req.body.object.notes,
				user_id: user
			};

		new PersonModel(object).save(function(err, data){
			if (err) {
				console.log("Create Person error:", err);
				res.status(500);
				res.send("Error creating line item");
				return;
			}
			// return just the created record
			res.send(JSON.stringify(data));
		});
	})

}
