var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var Grade = require('../classes/grade');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next) {
  if(!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// get grade list
router.get('/grades', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('get /grades:' + err);
  });
  Grade.find({}, function(err, grades) {
    if(err) console.log('get /grades find :' + err);
    var s = {};
    s.grades = grades;
    res.send(s);
    mongoose.connection.close();
  });
});

// add new grade
router.post('/grades', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('post grades connect:' + err);
  });
  var newGrade = new Grade(req.body);
  newGrade.save(function(err) {
    if(err) console.log('post grades save:' + err);
    res.end();
    mongoose.connection.close();
  });
});

// delete a grade
router.delete('/grades/:gid', auth, function(req, res) {
  var gid = req.params.gid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('delete grade connect:' + err);
  });
  Grade.remove({ _id: gid }, function(err) {
    if(err) console.log('delete grade' + err);
    res.end();
    mongoose.connection.close();
  });
});

module.exports = router;
