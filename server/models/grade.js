var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/packer");
autoIncrement.initialize(connection);
mongoose.connection.close();

var gradeSchema = new Schema({
  _id: { type: Number },
  name: { type: String }
});

gradeSchema.plugin(autoIncrement.plugin, { model: 'Grade', startAt: 0 });

module.exports = mongoose.model('Grade', gradeSchema);
