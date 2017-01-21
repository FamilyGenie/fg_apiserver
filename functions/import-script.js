module.exports = function(mongoose, PersonModel, StagedPersonModel) {
  
  StagedPersonModel.find({ "sexAtBirth" : "F" },
    function(err, res) {
      if (err) {
        return console.log(err);
      }
      console.log("in stagedperosnmodel find")
      var stagedPeople = res;
      PersonModel.find({ "sexAtBirth" : "F" },
        function(err,res) {
          if (err) {
            return console.log(err);
          }
          var people = res;
          for (i in stagedPeople) {
            var exists = false;
            for (k in people) {
              if (stagedPeople[i].fName === people[k].fName || stagedPeople[i].lName === people[k].lName || stagedPeople[i].sexAtBirth === people[k].sexAtBirth) {
                exists = true;
              }
            }
            if (exists === true) {
             object = {
                fName: stagedPeople[i].fName,
                mName: stagedPeople[i].mName,
                lName: stagedPeople[i].lName,
                sexAtBirth: stagedPeople[i].sexAtBirth,
                birthDate: stagedPeople[i].birthDate,
                birthPlace: stagedPeople[i].birthPlace,
                deathDate: stagedPeople[i].deathDate,
                deathPlace: stagedPeople[i].deathPlace,
                notes: stagedPeople[i].notes,
              };
            // console.log(object)

            new PersonModel(object).save(function(err, data){
              if (err) {
                return ("Error creating line item" + err);
              }
              console.log(JSON.stringify(data));
            });
            }
          }
        })

    });

  // db.eval(compareCollections);

}
