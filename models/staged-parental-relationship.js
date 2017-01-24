module.exports = function(mongoose) {

	var StagedParentalRelModel = mongoose.model("StagedParentalRelationship",{
		child_id: String,
		parent_id: String,
		relationshipType: String,
		subType: String,
		startDate: Date,
		endDate: Date,
    genie_id: ObjectId,
    ignore: Boolean,
		user_id: String
	});

	return StagedParentalRelModel;
};
