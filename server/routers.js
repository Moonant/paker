var express = require('express');
var passport = require('./passport');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

// main page router
router.get('/main', auth, function(req, res){
  res.send([{name: "user1"}, {name: "user2"}]);
});

// check if logged in
router.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
router.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});

module.exports = router;
