var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var User = require('../classes/user');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// main page router
router.get('/user', auth, function(req, res){
  res.send([{name: "user1"}, {name: "user2"}]);
});

// check if logged in
router.get('/user/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
router.post('/user/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
router.post('/user/logout', function(req, res){
  req.logOut();
  res.send(200);
});

// route to register
router.post('/user/register', function(req, res) {
  var user = req.body;
  // get post body
  var newUser = new User(user);
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/users';
  mongoose.connect(connStr, function(err) {
    if(err) throw err;
  });
  newUser.save(function(err) {
    if(err) {
      res.send({
        message: 'already existed'
      });
    }
    else {
      res.send(newUser);
    }
    mongoose.connection.close();
  });
});

module.exports = router;
