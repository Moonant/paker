var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/packer");

autoIncrement.initialize(connection);
mongoose.connection.close();

var classSchema = new Schema({
  _id: { type: Number },
  name: { type: String},
  grade: { 
    _id: { type: Number },
    name: { type: String }
  }
});

//classSchema.plugin(autoIncrement.plugin, 'Class');

var majorSchema = new Schema({
  _id: { type: Number },
  name: { type: String },
  classes: [ classSchema ]
});

majorSchema.plugin(autoIncrement.plugin, 'Major');

var apartmentSchema = new Schema({
  _id: { type: Number },
  name: { type: String, required: true},
  majors: [ majorSchema ]
});

apartmentSchema.plugin(autoIncrement.plugin, 'Apartment');

module.exports = mongoose.model('Apartment', apartmentSchema);
