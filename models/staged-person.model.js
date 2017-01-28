module.exports = function(mongoose) {
  var StagedPersonModel = mongoose.model("Gedcom_Person", {
        fName : String,
        lName : String,
        sexAtBirth : String,
        birthDate : Date,
        approxDate : String,
        birthPlace : String,
        deathDate : Date,
        approxDate : String,
        deathPlace : String,
        personId : String,
        ignore : Boolean,
        genie_id : ObjectId,
        user_id : String
  });

  return StagedPersonModel;

};
