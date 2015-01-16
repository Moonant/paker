var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/packer");

autoIncrement.initialize(connection);
mongoose.connection.close();

var teacherSchema = new Schema({
  _id: { type: Number },
  name: { type: String },
  apartment: {
    _id: { type: Number },
    name: { type: String }
  }
});

teacherSchema.plugin(autoIncrement.plugin, 'Teacher');

module.exports = mongoose.model('Teacher', teacherSchema);
