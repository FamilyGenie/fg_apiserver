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
        user_id : String
  });

  return StagedPersonModel;

};
