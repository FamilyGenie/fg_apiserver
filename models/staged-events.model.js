module.exports = function(mongoose) {

  var StagedEventsModel = mongoose.model("Gedcom_Events", {
    personId : String,
    eventType : String,
    eventDate : Date,
    eventPlace : String,
    approxDate : String,
    genie_id : ObjectId,
    ignore : Boolean,
    user_id: String
  });

  return StagedEventsModel;

};
