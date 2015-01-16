var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var MongoClient = require('mongodb');
var Apartment = require('../classes/apartment');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next) {
  if(!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// add a apartment
router.post('/apartments', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log(err);
  });
  var newApartment = new Apartment(req.body);
  newApartment.save(function(err) {
    if(err) console.log(err);
    res.end();
    mongoose.connection.close();
  });
});

// add a class to specifid apartment and major
router.post('/apartments/:aptid/majors/:mjid/classes', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  var aptid = req.params.aptid;
  var mjid = req.params.mjid;
  var newClass = req.body.class;
  mongoose.connect(connStr, function(err) {
    if(err) console.log(err);
  });
  var callback = function(err) {
    if(err) console.log(err);
    mongoose.connection.close();
  };
  Apartment.update(
    { _id: aptid, 'majors._id': mjid },
    { $push: { 'majors.$.classes': newClass }},
    callback
  );
  res.end();
});

// add a major to specified apartment
router.post('/apartments/:aptid/majors', auth, function(req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  var aptid = req.params.aptid;
  mongoose.connect(connStr, function(err) {
    if(err) throw err;
  });
  var newMajor = req.body.major;
  /*
  newMajor.classes = [];
  newMajor.classes.push({
    name: 'Do'
  });
  */
  Apartment.findOne({ _id: aptid }, function(err, apartment) {
    apartment.majors.push(newMajor);
    apartment.save(function(err) {
      mongoose.connection.close();
      if(err) return err;
    });
  });
  res.end();
});

// get apartments
router.get('/apartments', auth, function(req, res) {// remember to add auth
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('get apartments' + err);
  });
  Apartment.find({}, function(err, apartments) {
    if(err) console.log('get apartments' + err);
    var s = {};
    s.apartments = apartments;
    res.send(s);
    mongoose.connection.close();
  });
});

// delete a apartment
router.delete('/apartments/:aptid', auth, function(req, res) {
  var aptid = req.params.aptid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('delete apartment' + err);
  });
  Apartment.remove({ _id: aptid }, function(err) {
    if(err) console.log('delete apartment' + err);
    res.end();
    mongoose.connection.close();
  });
});

// delete a major
router.delete('/apartments/:aptid/majors/:mjid', auth, function(req, res) {
  var aptid = req.params.aptid;
  var mjid = req.params.mjid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('delete major' + err);
  });
  Apartment.update(
    { _id: aptid },
    { $pull: {'majors': {_id: mjid}} },
    function(err) {
      if(err) console.log('delete major'+err);
      res.end();
      mongoose.connection.close();
    }
  );
});

// delete a class
router.delete('/apartments/:aptid/majors/:mjid/classes/:clsid', 
  auth, function(req, res) {

  var aptid = req.params.aptid;
  var mjid = req.params.mjid;
  var clsid = req.params.clsid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function(err) {
    if(err) console.log('delete class' + err);
  });
  Apartment.update(
    { _id: aptid, 'majors._id': mjid },
    { $pull: {'majors.$.classes': {_id: clsid}} },
    function(err) {
      if(err) console.log('delete class'+err);
      res.end();
      mongoose.connection.close();
    }
  );
});

module.exports = router;
