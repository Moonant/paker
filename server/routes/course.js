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
router.post('/courses', auth, function(req, res) {
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('post /course' + err);
  });
  var newCourse = new Course(req.body);
  console.dir(req.body);
  var invalid = newCourse.name === null;
  invalid = invalid || newCourse.intermHours === null;
  invalid = invalid || newCourse.isCompulsory === null;
  invalid = invalid || newCourse.grade === {};
  invalid = invalid || newCourse.teacher === {};
  if(invalid) {
    res.end();
    mongoose.connection.close();
    return;
  }
  newCourse.save(function(err) {
    if(err) console.log(err);
    mongoose.connection.close();
    res.end();
  });
});

// get courses
router.get('/courses', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('get courses' + err);
  });
  Course.find({}, function(err, courses) {
    if(err) console.log('get courses' + err);
    var s = {};
    s.courses = courses;
    mongoose.connection.close();
    res.send(s);
  });
});

// delete a apartment
router.delete('/courses/:crsid', auth, function(req, res) {
  var crsid = req.params.crsid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('delete course' + err);
  });
  Course.remove({ _id: crsid }, function(err) {
    if(err) console.log('delete course' + err);
    res.end();
    mongoose.connection.close();
  });
});

module.exports = router;
