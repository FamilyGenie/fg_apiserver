module.exports = function(mongoose, PersonModel) {

	ObjectId = mongoose.Schema.ObjectId;

	var ParentalRelModel = mongoose.model("ParentalRelationship",{
		child_id: {type: ObjectId, ref: PersonModel},
		parent_id: {type: ObjectId, ref: PersonModel},
		relationshipType: String,
		subType: String,
    startDateUser: String,
		startDate: Date,
    approxStart: String,
    endDateUser: String,
		endDate: Date,
    approxEnd: String,
		user_id: String
	});

	return ParentalRelModel;
};
