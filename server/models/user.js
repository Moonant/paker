var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 11;

var userSchema = new Schema({
  username: { type: String, required: true, index: {unique: true} },
  password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
  var user = this;
  var iterations = 1111;
  var keylen = 24;
  
  // only hash the password if it has been modified
  if(!user.isModified('password')) return next();
  // generate a salt
  
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt) {
    if(err) return next(err);

    // hash the password
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });

  });
});

userSchema.methods.validPassword = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return done(err);
    done(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
