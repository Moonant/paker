var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var Course = require('../models/course');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// add a course
router.post('/upload', multipartyMiddleware, function(req, res) {
  var file = req.files.file;
});

module.exports = router;
