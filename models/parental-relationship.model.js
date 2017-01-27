module.exports = function(mongoose, PersonModel) {

	ObjectId = mongoose.Schema.ObjectId;

	var ParentalRelModel = mongoose.model("ParentalRelationship",{
		child_id: String,
		parent_id: String,
		relationshipType: String,
		subType: String,
		startDate: Date,
		endDate: Date,
		user_id: String
	});

	return ParentalRelModel;
};
