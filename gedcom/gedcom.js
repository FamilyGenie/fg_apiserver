var auth = require('../authentication');
var multer = require('multer');
var exec = require('child_process').exec;
var upload = multer({ dest: './gedcom/uploads/' });
var type = upload.single('gedcom');
var importScript = require('../functions/import-script.js')

module.exports = function(app, mongoose, bodyParser, passport, PersonModel, StagedPersonModel) {

  // I thought these lines were needed. But it now appears to be working without them. Leaving them commented out for now.
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));

  // these lines not needed, as the domain of this server is the same as the domain running the Angular code. Keeping these here just in case.
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  // I couldn't figure out how to change the filename that is sent over, and saw that the action from the client side was sending the name "filename", so using that name here.
  app.post("/uploads", auth.isAuthenticated, type, function(req, res) {
    var user_id = req.decoded._doc.userName;
    console.log("inside gedcom parse and import for user: ", user_id);
    res.status(200).send(req.file);

    // parse and import people
    exec('python ./gedcom/gedcomparse.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'indi.json ' + user_id,  // run the python program on the info
    function(err) {
      if(err) {
        console.log('python parse failed', err);
      }
    else {
      // this call imports the file that was just uploaded into mongoDB
      exec('mongoimport --db test --collection gedcom_people --type json --file ./gedcom/jsonfiles/' + req.file.filename + 'indi.json --jsonArray', function(err) {
        if(err) {
          console.log('mongo import failed', err);
        }
        else {
          console.log('people json file imported to mongo');
        }
      });
    }
    });

    // parse and import parents
    exec('python ./gedcom/gedcomparent.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'parent.json ' + user_id,  // run the python program on the info
      function(err) {
      if(err) {
        console.log('python parse failed', err);
      }
      else {
        exec('mongoimport --db test --collection gedcom_parents --type json --file ./gedcom/jsonfiles/' + req.file.filename + 'parent.json --jsonArray', function(err) { // imports the file that was just uploaded into mongoDB
          if(err) {
            console.log('mongo import failed', err);
          }
          else {
            console.log('parent json file imported to mongo');
          }
        });
      }
    });

    // parse and import pair bonds
    exec('python ./gedcom/gedcompairbonds.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'pairbond.json ' + user_id,  // run the python program on the info
      function(err) {
      if(err) {
        console.log('python parse failed', err);
      }
      else {
        exec('mongoimport --db test --collection gedcom_pairbond --type json --file ./gedcom/jsonfiles/' + req.file.filename + 'pairbond.json --jsonArray', function(err) { // imports the file that was just uploaded into mongoDB
          if(err) {
            console.log('mongo import failed', err);
          }
          else {
            console.log('pairbond json file imported to mongo');
          }
        });
      }
    });

  exec('python ./gedcom/gedcomevents.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'event.json ',
    function(err) {
      if (err) {
        console.log('python parse failed', err)
      }
      else {
        exec('mongoimport --db test --collection gedcom_events --type json --file ./gedcom/jsonfiles/' + req.file.filename + 'event.json --jsonArray',
        function(err) {
          if (err) {
            console.log('mongo import failed events' + err)
          }
          else {
            console.log('events json imported to mongo');
          }
        });
      }
    });


    importScript(mongoose, PersonModel, StagedPersonModel)

  });

  // this should not be needed any more. Keeping around if needed for troubleshooting
  app.get("/uploaddirect", function(req, res) {
      res.sendFile(__dirname + "/upload.html");
  });
};
