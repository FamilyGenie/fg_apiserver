module.exports = function(mongoose, PersonModel) {

	ObjectId = mongoose.Schema.ObjectId;

	var PairBondModel = mongoose.model("PairBondRelationship",{
		personOne_id: String,
		personTwo_id: String,
		relationshipType: String,
		startDate: Date,
		endDate: Date,
		user_id: String
	});

	return PairBondModel;
};
