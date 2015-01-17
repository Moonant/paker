var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/packer");

autoIncrement.initialize(connection);
mongoose.connection.close();

var courseSchema = new Schema({
  _id: { type: Number },
  name: { type: String },
  teacher: {
    _id: { type: Number },
    name: { type: String}
  },
  apartment: {
    _id: { type: Number },
    name: { type: String}
  },
  major: {
    _id: { type: Number },
    name: { type: String }
  },
  grade: {
    _id: { type: Number },
    name: { type: String }
  },
  classes: [ 
    { 
      _id: { type: Number },
      name: { tyep: String }
    }
  ],
  onlineHours: { type: Number },
  lectureHours: { type: Number },
  onlineHours: { type: Number },
  intermHours: { type: Number },
  labHours: { type: Number },
  extracurricular: { type: Number },
  totalHours: { type: Number },
  isCompulsory: { type: Boolean },
  category: {
    _id: { type: Number },
    name: { type: String }
  },
  arrange: {
    weeks: [Number],
    timeNPlace: [{
      weekday: { 
        _id: { type: Number },
        name: { type: String }
      },
      // means the class' position in on day
      position: { 
        _id: { type: Number },
        name: { type: String }
      },//
      classrome: { type: String }//
    }],
    describe: { type: String }
  }
});

courseSchema.plugin(autoIncrement.plugin, 'Course');

module.exports = mongoose.model('Course', courseSchema);
