var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('./passport');
var session = require('express-session');
var user = require('./routes/users.js');
var course = require('./routes/course.js');
var apartment = require('./routes/apartment.js');
var teacher = require('./routes/teacher.js');
var grade = require('./routes/grade.js');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser('securedsession'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'securedsession',
  resave: false,
  saveUninitialized: true,
  }));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session()); // Add passport initialization

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, '../client')));
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

if (app.get('env') === 'production') {
  // changes it to use the optimized version for production
  app.use(express.static(path.join(__dirname, '/dist')));
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    app.use(express.static(path.join(__dirname, 'dist/')));
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
  });
}

app.use(user);
app.use(course);
app.use(apartment);
app.use(teacher);
app.use(grade);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
