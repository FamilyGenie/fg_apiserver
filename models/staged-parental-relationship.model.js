module.exports = function(mongoose, PersonModel) {

	var StagedParentalRelModel = mongoose.model("Gedcom_Parent",{
		child_id: String,
		parent_id: String,
		relationshipType: String,
		subType: String,
		startDate: Date,
    startDateUser: String,
    approxStart: String,
		endDate: Date,
    endDateUser: String,
    approxEnd: String,
    genie_id: {type: ObjectId, ref: PersonModel},
    ignore: Boolean,
		user_id: String
	});

	return StagedParentalRelModel;
};
