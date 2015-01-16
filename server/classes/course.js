var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/packer");

autoIncrement.initialize(connection);
mongoose.connection.close();

var courseSchema = new Schema({
  id: { type: Number, required: true, index: {unique: true} },
  name: { type: String },
  teacher: {
    id: { type: Number },
    name: { type: String}
  },
  apartment: {
    id: { type: Number },
    name: { type: String}
  },
  major: {
    id: { type: Number },
    name: { type: String }
  },
  arrange: {
    weeks: [Number],
    timeNPlace: [{
      day: { type: Number},
      position: { type: Number},
      classrome: { type: String }
    }],
    describe: { type: String }
  }
});

courseSchema.plugin(autoIncrement.plugin, 'Course');

module.exports = mongoose.model('Course', courseSchema);
