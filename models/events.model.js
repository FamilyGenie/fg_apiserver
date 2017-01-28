module.exports = function(mongoose) {

  var EventsModel = mongoose.model("Events", {
    person_id : String,
    eventType : String,
    eventDateUser: String,
    eventDate : Date,
    eventPlace : String,
    familyContext : String,
    localContext : String,
    worldContext : String,
    user_id: String
  });

  return EventsModel;

};
