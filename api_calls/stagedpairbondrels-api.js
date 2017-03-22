var auth = require('../authentication');
var mongoose = require('mongoose');
var winston = require('winston');

winston.level = 'debug';
var logLevel = 'debug';
// var logLevel = 'info';
var date = new Date();

mongoose.Promise = global.Promise;

module.exports = function(app, StagedPairBondRelModel) {
  app.get('/api/v2/staging/pairbondrels', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in get staged pairbonds");
    var user = req.decoded._doc.userName;
    StagedPairBondRelModel.find(
      { user_id: user },
      function(err, data) {
        if (err) {
          res.status(500).send("Error getting all staged pairbonds" + err);
          return;
        }
        res.status(200).send(JSON.stringify(data));
      }
    )
  });

  app.post('/api/v2/staging/pairbondrel/update', auth.isAuthenticated, function(req, res) {
    winston.log(logLevel, date + ": in update staged pairbondrels");
    var user = req.decoded._doc.userName;
    const set = {};
    set[req.body.object.field] = req.body.object.value;
    StagedPairBondRelModel.findOneAndUpdate(
      {
        _id: req.body.object._id,
        user_id: user
      },
      { $set : set },
      { new : true },
      function(err, data) {
        if(err) {
          res.status(500).send('error updating staged pairbond relationship' + err)
        }
        res.status(200).send(data);
      })
  })

  app.get('/wahoo', auth.isAuthenticated, function(req, res) {
    var ids = [
"58d2b10f4cdc7c13b8f183e7",
"58d2b10f4cdc7c13b8f1839c",
"58d2b10f4cdc7c13b8f183dd",
"58d2b10f4cdc7c13b8f1840f",
"58d2b10f4cdc7c13b8f184be",
"58d2b10f4cdc7c13b8f18509",
"58d2b10f4cdc7c13b8f1852c",
"58d2b10f4cdc7c13b8f185a9",
"58d2b10f4cdc7c13b8f1868a",
"58d2b10f4cdc7c13b8f183d4",
"58d2b10f4cdc7c13b8f183e2",
"58d2b10f4cdc7c13b8f183f1",
"58d2b10f4cdc7c13b8f1842d",
"58d2b10f4cdc7c13b8f1846e",
"58d2b10f4cdc7c13b8f184a0",
"58d2b10f4cdc7c13b8f184f5",
"58d2b10f4cdc7c13b8f1850e",
"58d2b10f4cdc7c13b8f18531",
"58d2b10f4cdc7c13b8f185ae",
"58d2b10f4cdc7c13b8f1868f",
"58d2b10f4cdc7c13b8f183d9",
"58d2b10f4cdc7c13b8f1840b",
"58d2b10f4cdc7c13b8f1846f",
"58d2b10f4cdc7c13b8f184f6",
"58d2b10f4cdc7c13b8f18564",
"58d2b10f4cdc7c13b8f185a5",
"58d2b10f4cdc7c13b8f18681",
"58d2b10f4cdc7c13b8f18690",
"58d2b10f4cdc7c13b8f1869f",
"58d2b10f4cdc7c13b8f183da",
"58d2b10f4cdc7c13b8f1843c",
"58d2b10f4cdc7c13b8f18478",
"58d2b10f4cdc7c13b8f18487",
"58d2b10f4cdc7c13b8f184ff",
"58d2b10f4cdc7c13b8f1859f",
"58d2b10f4cdc7c13b8f185b8",
"58d2b10f4cdc7c13b8f185db",
"58d2b10f4cdc7c13b8f18680",
"58d2b10f4cdc7c13b8f18699",
"58d2b10f4cdc7c13b8f186bc",
"58d2b10f4cdc7c13b8f183e3",
"58d2b10f4cdc7c13b8f183f2",
"58d2b10f4cdc7c13b8f1842e",
"58d2b10f4cdc7c13b8f18479",
"58d2b10f4cdc7c13b8f18488",
"58d2b10f4cdc7c13b8f1849c",
"58d2b10f4cdc7c13b8f18500",
"58d2b10f4cdc7c13b8f1850f",
"58d2b10f4cdc7c13b8f18532",
"58d2b10f4cdc7c13b8f185af",
"58d2b10f4cdc7c13b8f185be",
"58d2b10f4cdc7c13b8f183e4",
"58d2b10f4cdc7c13b8f183f3",
"58d2b10f4cdc7c13b8f1846b",
"58d2b10f4cdc7c13b8f1849d",
"58d2b10f4cdc7c13b8f184f7",
"58d2b10f4cdc7c13b8f18565",
"58d2b10f4cdc7c13b8f185a6",
"58d2b10f4cdc7c13b8f18682",
"58d2b10f4cdc7c13b8f18691",
"58d2b10f4cdc7c13b8f186a0",
"58d2b10f4cdc7c13b8f18503",
"58d2b10f4cdc7c13b8f183d8",
"58d2b10f4cdc7c13b8f184b9",
"58d2b10f4cdc7c13b8f18504",
"58d2b10f4cdc7c13b8f185a4",
"58d2b10f4cdc7c13b8f185bd",
"58d2b10f4cdc7c13b8f18685",
"58d2b10f4cdc7c13b8f1869e",
"58d2b10f4cdc7c13b8f1839d",
"58d2b10f4cdc7c13b8f183e8",
"58d2b10f4cdc7c13b8f18465",
"58d2b10f4cdc7c13b8f184a1",
"58d2b10f4cdc7c13b8f18505",
"58d2b10f4cdc7c13b8f18514",
"58d2b10f4cdc7c13b8f185dc",
"58d2b10f4cdc7c13b8f186b8",
"58d2b10f4cdc7c13b8f1839e",
"58d2b10f4cdc7c13b8f183e9",
"58d2b10f4cdc7c13b8f18470",
"58d2b10f4cdc7c13b8f184a2",
"58d2b10f4cdc7c13b8f184fc",
"58d2b10f4cdc7c13b8f18646",
"58d2b10f4cdc7c13b8f18687",
"58d2b10f4cdc7c13b8f183dc",
"58d2b10f4cdc7c13b8f1840e",
"58d2b10f4cdc7c13b8f18468",
"58d2b10f4cdc7c13b8f184bd",
"58d2b10f4cdc7c13b8f18508",
"58d2b10f4cdc7c13b8f1852b",
"58d2b10f4cdc7c13b8f185a8",
"58d2b10f4cdc7c13b8f18689",
"58d2b10f4cdc7c13b8f183e0",
"58d2b10f4cdc7c13b8f1842b",
"58d2b10f4cdc7c13b8f1846c",
"58d2b10f4cdc7c13b8f18485",
"58d2b10f4cdc7c13b8f185ac",
"58d2b10f4cdc7c13b8f185bb",
"58d2b10f4cdc7c13b8f18692",
"58d2b10f4cdc7c13b8f186a1",
"58d2b10f4cdc7c13b8f186b5",
"58d2b10f4cdc7c13b8f183f6",
"58d2b10f4cdc7c13b8f18473",
"58d2b10f4cdc7c13b8f18482",
"58d2b10f4cdc7c13b8f184fa",
"58d2b10f4cdc7c13b8f18513",
"58d2b10f4cdc7c13b8f18568",
"58d2b10f4cdc7c13b8f185b3",
"58d2b10f4cdc7c13b8f185d6",
"58d2b10f4cdc7c13b8f18649",
"58d2b10f4cdc7c13b8f18694",
"58d2b10f4cdc7c13b8f186b7",
"58d2b10f4cdc7c13b8f183de",
"58d2b10f4cdc7c13b8f18410",
"58d2b10f4cdc7c13b8f18474",
"58d2b10f4cdc7c13b8f18483",
"58d2b10f4cdc7c13b8f184ba",
"58d2b10f4cdc7c13b8f184fb",
"58d2b10f4cdc7c13b8f1852d",
"58d2b10f4cdc7c13b8f185aa",
"58d2b10f4cdc7c13b8f185b9",
"58d2b10f4cdc7c13b8f18686",
"58d2b10f4cdc7c13b8f183df",
"58d2b10f4cdc7c13b8f18411",
"58d2b10f4cdc7c13b8f18466",
"58d2b10f4cdc7c13b8f1852e",
"58d2b10f4cdc7c13b8f185a1",
"58d2b10f4cdc7c13b8f185b0",
"58d2b10f4cdc7c13b8f185bf",
"58d2b10f4cdc7c13b8f1869b",
"58d2b10f4cdc7c13b8f1839b",
"58d2b10f4cdc7c13b8f18477",
"58d2b10f4cdc7c13b8f18486",
"58d2b10f4cdc7c13b8f184fe",
"58d2b10f4cdc7c13b8f1859e",
"58d2b10f4cdc7c13b8f185da",
"58d2b10f4cdc7c13b8f1867f",
"58d2b10f4cdc7c13b8f186bb",
"58d2b10f4cdc7c13b8f183d6",
"58d2b10f4cdc7c13b8f183f4",
"58d2b10f4cdc7c13b8f1847b",
"58d2b10f4cdc7c13b8f1849e",
"58d2b10f4cdc7c13b8f184fd",
"58d2b10f4cdc7c13b8f1852f",
"58d2b10f4cdc7c13b8f185a2",
"58d2b10f4cdc7c13b8f18647",
"58d2b10f4cdc7c13b8f18688",
"58d2b10f4cdc7c13b8f1846a",
"58d2b10f4cdc7c13b8f185a0",
"58d2b10f4cdc7c13b8f1869a",
"58d2b10f4cdc7c13b8f186bd",
"58d2b10f4cdc7c13b8f183d5",
"58d2b10f4cdc7c13b8f1842a",
"58d2b10f4cdc7c13b8f18475",
"58d2b10f4cdc7c13b8f18484",
"58d2b10f4cdc7c13b8f18501",
"58d2b10f4cdc7c13b8f18510",
"58d2b10f4cdc7c13b8f185d8",
"58d2b10f4cdc7c13b8f183e1",
"58d2b10f4cdc7c13b8f183f0",
"58d2b10f4cdc7c13b8f1842c",
"58d2b10f4cdc7c13b8f1846d",
"58d2b10f4cdc7c13b8f1849f",
"58d2b10f4cdc7c13b8f184f4",
"58d2b10f4cdc7c13b8f1850d",
"58d2b10f4cdc7c13b8f18530",
"58d2b10f4cdc7c13b8f185ad",
"58d2b10f4cdc7c13b8f185bc",
"58d2b10f4cdc7c13b8f1868e",
"58d2b10f4cdc7c13b8f1869d",
"58d2b10f4cdc7c13b8f183e5",
"58d2b10f4cdc7c13b8f1840d",
"58d2b10f4cdc7c13b8f18471",
"58d2b10f4cdc7c13b8f184f3",
"58d2b10f4cdc7c13b8f18511",
"58d2b10f4cdc7c13b8f185b1",
"58d2b10f4cdc7c13b8f185c0",
"58d2b10f4cdc7c13b8f186ba",
"58d2b10f4cdc7c13b8f186c3",
"58d2b10f4cdc7c13b8f1840c",
"58d2b10f4cdc7c13b8f1842f",
"58d2b10f4cdc7c13b8f1847a",
"58d2b10f4cdc7c13b8f18506",
"58d2b10f4cdc7c13b8f18515",
"58d2b10f4cdc7c13b8f18529",
"58d2b10f4cdc7c13b8f185ba",
"58d2b10f4cdc7c13b8f186b9",
"58d2b10f4cdc7c13b8f183e6",
"58d2b10f4cdc7c13b8f183f5",
"58d2b10f4cdc7c13b8f18472",
"58d2b10f4cdc7c13b8f18481",
"58d2b10f4cdc7c13b8f184a4",
"58d2b10f4cdc7c13b8f184f9",
"58d2b10f4cdc7c13b8f18512",
"58d2b10f4cdc7c13b8f18567",
"58d2b10f4cdc7c13b8f185b2",
"58d2b10f4cdc7c13b8f185c1",
"58d2b10f4cdc7c13b8f185d5",
"58d2b10f4cdc7c13b8f18648",
"58d2b10f4cdc7c13b8f18693",
"58d2b10f4cdc7c13b8f186a2",
"58d2b10f4cdc7c13b8f186b6",
"58d2b10f4cdc7c13b8f18412",
"58d2b10f4cdc7c13b8f18476",
"58d2b10f4cdc7c13b8f184bc",
"58d2b10f4cdc7c13b8f184f8",
"58d2b10f4cdc7c13b8f18507",
"58d2b10f4cdc7c13b8f18516",
"58d2b10f4cdc7c13b8f1852a",
"58d2b10f4cdc7c13b8f18683",
"58d2b10f4cdc7c13b8f186c8",
"58d2b10f4cdc7c13b8f185a3",
"58d2b10f4cdc7c13b8f18684",
"58d2b10f4cdc7c13b8f1839a",
"58d2b10f4cdc7c13b8f183db",
"58d2b10f4cdc7c13b8f18467",
"58d2b10f4cdc7c13b8f18480",
"58d2b10f4cdc7c13b8f184a3",
"58d2b10f4cdc7c13b8f184cb",
"58d2b10f4cdc7c13b8f18566",
"58d2b10f4cdc7c13b8f185a7",
"58d2b10f4cdc7c13b8f185d9",
"58d2b10f4cdc7c13b8f1868d",
"58d2b10f4cdc7c13b8f1869c",
"58d2b10f4cdc7c13b8f186c4",
"58d2b10f4cdc7c13b8f186be",
"58d2b10f4cdc7c13b8f186c9",
"58d2b10f4cdc7c13b8f186c1",
"58d2b10f4cdc7c13b8f186bf",
"58d2b10f4cdc7c13b8f186ca",
"58d2b10f4cdc7c13b8f186c7",
"58d2b10f4cdc7c13b8f186c0",
"58d2b10f4cdc7c13b8f186c6",
"58d2b10f4cdc7c13b8f186c5",
"58d2b10f4cdc7c13b8f186c2",
"58d2b10f4cdc7c13b8f186cb",
"58d2b10f4cdc7c13b8f186cc",
]
    for (var id in ids) {
      StagedPairBondRelModel.find({'_id' : ids[id]}, function(err, data) {
        if (err) { res.status(500).send(err) }
        console.log(data)
      })
    }
  })
}
