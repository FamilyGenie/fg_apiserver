module.exports = function(mongoose) {

  var StagedEventsModel = mongoose.model("StagedEvents", {
    personId : String,
    eventType : String,
    eventDate : Date,
    eventPlace : String,
    approxDate : String,
    genie_id : ObjectId,
    user_id: String
  });

  return StagedEventsModel;

};
