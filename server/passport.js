var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var User = require('./classes/user');

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    var connStr = 'mongodb://localhost:27017/users';
    mongoose.connect(connStr, function(err) {
      if(err) throw err;
    });
    User.findOne({ username: username }, function(err, user) {
      mongoose.connection.close();
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      user.validPassword(password, function(err, isMatch) {
        if(isMatch){
          user.password = 'password';
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
