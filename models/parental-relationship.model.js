module.exports = function(mongoose, PersonModel) {

	ObjectId = mongoose.Schema.ObjectId;

	var StagedParentalRelModel = mongoose.model("StagedParentalRelationship",{
		child_id: String,
		parent_id: String,
		relationshipType: String,
		subType: String,
		startDate: Date,
		endDate: Date,
		user_id: String
	});

	return StagedParentalRelModel;
};
