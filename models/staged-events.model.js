module.exports = function(mongoose, PersonModel) {

  var StagedEventsModel = mongoose.model("Gedcom_Event", {
    personId : String,
    eventType : String,
    eventDate : Date,
    eventPlace : String,
    approxDate : String,
    genie_id : {type: ObjectId, ref: PersonModel},
    ignore : Boolean,
    user_id: String
  });

  return StagedEventsModel;

};
