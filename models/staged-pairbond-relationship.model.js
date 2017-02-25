module.exports = function(mongoose, PersonModel) {

	var StagedPairBondRelModel = mongoose.model("Gedcom_Pairbond",{
		personOne_id: String,
		personTwo_id: String,
		relationshipType: String,
		startDate: Date,
		endDate: Date,
    genie_id: {type: ObjectId, ref: PersonModel},
    ignore: Boolean,
		user_id: String
	});

	return StagedPairBondRelModel;
};
