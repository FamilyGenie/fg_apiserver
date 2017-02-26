var jwt = require('jsonwebtoken');
var config = require('./config');

var Authentication = {};

Authentication.isAuthenticated = function(req, res, next) {
   var token = req.body.token || req.query.token || req.headers['x-access-token'];
   // console.log('in auth with token: ', token);
   if (token) {
       jwt.verify(token, config.jwtSecret, function(err, decoded) {
           if (err) {
               res.status(403);
               res.json({ success: false, message: 'Failed to authenticate token.' });
               return;
           } else {
               req.decoded = decoded;
               next();
           }
       });
   } else {
        res.status(403)
        res.send({success: false, message: 'No token provided.'});
        return;
   }
};

module.exports = Authentication;
