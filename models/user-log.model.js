module.exports = function(mongoose) {

  var UserLogModel = mongoose.model("UserLog", {
    action : String,
    logDate: Date,
    user_id : String
  });

  return UserLogModel;

};
