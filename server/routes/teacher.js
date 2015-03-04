var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var Teacher = require('../models/teacher');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next) {
  if(!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// get teacher list
router.get('/teachers', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('get /teachers:' + err);
  });
  Teacher.find({}, function(err, teachers) {
    if(err) console.log('get /teachers find :' + err);
    var s = {};
    s.teachers = teachers;
    res.send(s);
    mongoose.connection.close();
  });
});

// add new teacher 
router.post('/teachers', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('post teachers connect:' + err);
  });
  var newTeacher = new Teacher(req.body);
  newTeacher.save(function(err) {
    if(err) console.log('post teachers save:' + err);
    res.end();
    mongoose.connection.close();
  });
});

// delete a teacher 
router.delete('/teachers/:tid', auth, function(req, res) {
  var tid = req.params.tid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('delete teachers connect:' + err);
  });
  Teacher.remove({ _id: tid }, function(err) {
    if(err) console.log('delete teacher' + err);
    res.end();
    mongoose.connection.close();
  });
});

module.exports = router;
