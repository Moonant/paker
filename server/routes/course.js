var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var Course = require('../classes/course');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// add a course
router.put('/course', auth, function(req, res) {
  // get sent data 
  var course = req

  var newCourse = new Course(user);
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) throw err;
  });
  newCourse.save(function(err) {
    if(err) {
      res.send({
        message: 'something wrong'
      });
    }
    else {
      res.send(newCourse);
    }
    mongoose.connection.close();
  });
});

module.exports = router;
