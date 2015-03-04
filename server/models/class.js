var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost/packer");

autoIncrement.initialize(connection);
mongoose.connection.close();

var classSchema = new Schema({
  _id: { type: Number },
  name: { type: String},
  grade: { 
    _id: { type: Number },
    name: { type: String }
  },
  major: { type: Number, ref: 'Major' }
});

classSchema.plugin(autoIncrement.plugin, 'Class');

module.exports = mongoose.model('Class', classSchema);
