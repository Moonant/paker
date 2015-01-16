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
router.get('/users', auth, function(req, res){
  res.send([{name: "user1"}, {name: "user2"}]);
});

// check if logged in
router.get('/users/loggedin', auth, function(req, res) {
  var user = req.user;
  user.isAuth = req.isAuthenticated()
  res.send(req.isAuthenticated() ? req.user : {isAuth: '0'});
});

// route to log in
router.post('/users/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to check existence 
router.post('/users/existence', function(req, res) {
  var user = req.body;
  var resUser = {};
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('post /users/existence:' + err);
  });
  User.findOne(user, function (err, existence) {
    mongoose.connection.close();
    if(existence) {
      resUser.existence = true;
    }
    else {
      resUser.existence = false;
    }
    res.send(resUser);
  });
});

// route to log out
router.post('/users/logout', auth, function(req, res){
  req.logOut();
  res.send(200);
});

// route to register
router.post('/users/register', function(req, res) {
  // get post body
  var user = req.body;
  var newUser = new User(user);
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('post /users/register:' + err);
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
