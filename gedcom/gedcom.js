var auth = require('../authentication');
var multer = require('multer');
var exec = require('child_process').exec;

var maxSize = 1024 * 1024;
var upload = multer({ 
  dest: './gedcom/uploads/', 
  limits: { fileSize : maxSize } 
});

/* Error Codes:
 * sent in the form 'XX.Y', where XX is the error and Y is the location
 * 27 : python conversion failed
 * 34 : mongodb import failed
 */

var type = upload.single('gedcom');

module.exports = function(app, mongoose, bodyParser, passport) {

  app.post("/uploads", auth.isAuthenticated, type, function(req, res) {
    var user_id = req.decoded._doc.userName;
    console.log("inside gedcom parse and import for user: ", user_id);

    // parse and import people
    exec('python ./gedcom/parse/indiparse.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'indi.json ' + user_id,
      // run the python program on the info
      function(err) {
        if(err) {
          console.log('something bad happened', err)
          // res.status(500).send({err, 'code': 27.1})
        }
      else {
        // this call imports the file that was just uploaded into mongoDB
        exec("mongoimport --db test --username 'appadmin' --password 'familygenie' --authenticationDatabase test --collection gedcom_people --type json --file ./gedcom/jsonfiles/" + req.file.filename + "indi.json --jsonArray",
          function(err) {
          if(err) {
            console.log('something bad happened', err)
            // res.status(500).send({err, 'code': 34.1})
          }
          else {
            // write a simple response to the front end, for progress
            console.log('imported Individual data to mongodb');
          }
        });
      }
    });

    // parse and import parents
    exec('python ./gedcom/parse/parentparse.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'parent.json ' + user_id,
      // run the python program on the info
      function(err) {
      if(err) {
        console.log('something bad happened', err)
        // res.status(500).send({err, 'code': 27.2})
      }
      else {
        exec("mongoimport --db test --username 'appadmin' --password 'familygenie' --authenticationDatabase test --collection gedcom_parents --type json --file ./gedcom/jsonfiles/" + req.file.filename + "parent.json --jsonArray",
          function(err) { // imports the file that was just uploaded into mongoDB
            if(err) {
              console.log('something bad happened', err)
              // res.status(500).send({err, 'code': 34.2})
            }
            else {
              console.log('imported ParentalRel data to mongodb')
              // res.write({step:02});
            }
        });
      }
    });

    // parse and import pair bonds
    exec('python ./gedcom/parse/pairbondparse.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'pairbond.json ' + user_id,
      // run the python program on the info
      function(err) {
      if(err) {
        console.log('something bad happened', err)
        // res.status(500).send({err, 'code': 27.3})
      }
      else {
        exec("mongoimport --db test --username 'appadmin' --password 'familygenie' --authenticationDatabase test --collection gedcom_pairbonds --type json --file ./gedcom/jsonfiles/" + req.file.filename + "pairbond.json --jsonArray",
          function(err) { // imports the file that was just uploaded into mongoDB
            if(err) {
              console.log('something bad happened', err)
              // res.status(500).send({err, 'code': 34.3})
            }
            else {
              console.log('imported PairBondRel data to mongodb')
              // res.write({step:03});
            }
        });
      }
    });

  exec('python ./gedcom/parse/eventparse.py ./gedcom/uploads/' + req.file.filename + ' ./gedcom/jsonfiles/' + req.file.filename + 'event.json ' + user_id,
    function(err) {
      if (err) {
        console.log('something bad happened', err)
        // res.status(500).send({err, 'code': 27.4})
      }
      else {
        exec("mongoimport --db test --username 'appadmin' --password 'familygenie' --authenticationDatabase test --collection gedcom_events --type json --file ./gedcom/jsonfiles/" + req.file.filename + "event.json --jsonArray",
          function(err) {
            if (err) {
              console.log('something bad happened', err)
              // res.status(500).send({err, 'code': 34.4})
            }
            else {
              console.log('imported Event data to mongodb')
              // res.write({step:04});
            }
        });
      }
    });

    // indicate completion
    res.status(200).send('success');

  });

  // this should not be needed any more. Keeping around if needed for troubleshooting
  app.get("/uploaddirect", function(req, res) {
      res.sendFile(__dirname + "/upload.html");
  });
};
