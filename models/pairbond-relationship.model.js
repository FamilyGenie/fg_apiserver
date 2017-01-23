module.exports = function(mongoose, PersonModel) {

	ObjectId = mongoose.Schema.ObjectId;

	var StagedPairBondModel = mongoose.model("StagedPairBondRelationship",{
		personOne_id: String,
		personTwo_id: String,
		relationshipType: String,
		startDate: Date,
		endDate: Date,
		user_id: String
	});

	return StagedPairBondModel;
};
