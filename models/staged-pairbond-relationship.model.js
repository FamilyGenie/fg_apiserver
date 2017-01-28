module.exports = function(mongoose) {

	var StagedPairBondModel = mongoose.model("Gedcom_Pairbond",{
		personOne_id: String,
		personTwo_id: String,
		relationshipType: String,
		startDate: Date,
		endDate: Date,
    genie_id: ObjectId,
    ignore: Boolean,
		user_id: String
	});

	return StagedPairBondModel;
};
