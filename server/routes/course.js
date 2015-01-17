var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var Course = require('../models/course');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// add a course
router.post('/course', auth, function(req, res) {
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('post /course' + err);
  });
  var newCourse = new Course(req.body);
  console.dir(newCourse);
  if(newCourse.name === null) return;
  if(newCourse.intermHours === null) return;
  if(newCourse.isCompulsory === null) return;
  if(newCourse.grade === {}) return;
  if(newCourse.teacher === {}) return;
  newCourse.save(function(err) {
    if(err) console.log(err);
    res.end();
    mongoose.connection.close();
  });
});

module.exports = router;
