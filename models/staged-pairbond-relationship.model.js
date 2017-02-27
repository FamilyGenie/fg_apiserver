module.exports = function(mongoose, PersonModel) {

	var StagedPairBondRelModel = mongoose.model("Gedcom_Pairbond",{
		personOne_id: String,
		personTwo_id: String,
		relationshipType: String,
		startDate: Date,
    approxStart: String,
		endDate: Date,
    approxEnd: String,
    genie_id: {type: ObjectId, ref: PersonModel},
    ignore: Boolean,
		user_id: String
	});

	return StagedPairBondRelModel;
};
