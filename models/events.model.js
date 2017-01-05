module.exports = function(mongoose) {

  // ObjectId = mongoose.Schema.ObjectId;

  var EventsModel = mongoose.model("Events", {
    person_id : String,
    type : String,
    eventDateUser: String,
    eventDate : Date,
    place : String,
    familyContext : String,
    localContext : String,
    worldContext : String,
    user_id: String
  });

  return EventsModel;

};
