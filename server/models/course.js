var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/packer");

autoIncrement.initialize(connection);
mongoose.connection.close();

var courseSchema = new Schema({
  _id: {type: Number},
  name: {type: String},
  teacher: {
    _id: {type: Number},
    name: {type: String}
  },
  apartment: {
    _id: {type: Number, unique: false},
    name: {type: String}
  },
  major: {
    _id: {type: Number, unique: false},
    name: {type: String}
  },
  grade: {
    _id: {type: Number, unique: false},
    name: {type: String}
  },
  classes: [
    {
      _id: {type: Number, unique: false},
      name: {type: String}
    }
  ],
  classesName: {type: String}, // needed to show the classes//
  onlineHours: {type: Number},
  lectureHours: {type: Number},
  intermHours: {type: Number},
  labHours: {type: Number},
  extracurricular: {type: Number},
  totalHours: {type: Number},
  type: {
    isCompulsory: {type: Boolean},
    name: {type: String}
  },
  category: {
    _id: {type: Number, unique: false},
    name: {type: String}
  },
  arrange: {
    weekSecs: [{
      endweek: {type: Number},
      startweek: {type: Number},
      name: {type: String}
    }],
    timeNPlace: [{
      weekday: {
        _id: {type: Number, unique: false},
        name: {type: String}
      },
      // means the class' position in on day
      position: {
        _id: {type: Number, unique: false},
        name: {type: String}
      },
      classrome: {type: String},
      name: {type: String}
    }],
    timeNPlaceName: {type: String},
    weeksName: {type: String}  // needed to show the weeks//
  }
});

courseSchema.plugin(autoIncrement.plugin, 'Course');

module.exports = mongoose.model('Course', courseSchema);
