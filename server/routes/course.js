var express = require('express');
var passport = require('../passport');
var mongoose = require('mongoose');
var Course = require('../models/course');
var router = express.Router();

// Define a middleware function to be used for every secured routes
var auth = function (req, res, next) {
  if (!req.isAuthenticated())
    res.status(401).end();
  else
    next();
};

// add a course
router.post('/courses', auth, function (req, res) {
  // connnect to mongodb
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('post /course' + err);
  });
  var newCourse = new Course(req.body);
  var invalid = newCourse.name === null;
  invalid = invalid || newCourse.intermHours === null;
  invalid = invalid || newCourse.isCompulsory === null;
  invalid = invalid || newCourse.grade === {};
  invalid = invalid || newCourse.teacher === {};
  if (invalid) {
    res.end();
    mongoose.connection.close();
    return;
  }
  newCourse.save(function (err) {
    if (err) console.log(err);
    mongoose.connection.close();
    res.end();
  });
});

// get courses
router.get('/courses', auth, function (req, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('get courses' + err);
  });
  Course.find({}, function (err, courses) {
    if (err) console.log('get courses' + err);
    var s = {};
    s.courses = courses;
    mongoose.connection.close();
    res.send(s);
  });
});

// delete a course
router.delete('/courses/:crsid', auth, function (req, res) {
  var crsid = req.params.crsid;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('delete course' + err);
  });
  Course.remove({_id: crsid}, function (err) {
    if (err) console.log('delete course' + err);
    res.end();
    mongoose.connection.close();
  });
});

// update a course
router.put('/courses/:crsid', auth, function (req, res) {
  var crsid = req.params.crsid;
  var updatedCourse = req.body;
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('update course' + err);
  });
  Course.findOne({_id: crsid}, function (err, course) {
    if (err) console.log('update course' + err);
    for (var attr in updatedCourse) {
      course[attr] = updatedCourse[attr];
    }
    course.save(function () {
      mongoose.connection.close();
    });
    res.end();
  });
});

router.put('/courses/:crsid/checkconflict', function (req, res) {
  var crsid = req.params.crsid;
  var preIndex = req.body.preindex;
  var weekDay = req.body.weekday;
  var position = req.body.position;
  var result = {
    status: false,
    isConfict: false,
    msg: ""
  };

  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('update course' + err);
  });

  Course.findOne({_id: crsid}, function (err, course) {
    if (err || !course) {
      result.msg = "无法查到课程";
      res.send(result);
      return;
    }

    result.status = true;

    var teacherId = course.teacher._id;
    var classIds = [];
    for (var i = 0; i < course.classes.length; i++) {
      classIds.push(course.classes[i]._id);
    }

    Course.find()
      .where({'arrange.timeNPlace.position._id': position})
      .where({'arrange.timeNPlace.weekday._id': weekDay})
      .or([{'classes._id': {"$in": classIds}}, {'teacher._id': teacherId}])
      .exec(function (err, docs) {
        if (docs.length > 0&&docs[0]._id != course._id) {
          result.isConfict = true;
          result.msg = "有冲突,无法更改";
          result.courses = docs;
          mongoose.connection.close();
          res.send(result);
        } else {
          result.isConfict = false;
          result.msg = "无冲突,更改完成";
          var newt = parseWeekPosition(weekDay, position, course.arrange.timeNPlace[preIndex].classrome);
          course.arrange.timeNPlace[preIndex].weekday._id = newt.weekday._id;
          course.arrange.timeNPlace[preIndex].weekday.name = newt.weekday.name;
          course.arrange.timeNPlace[preIndex].position._id = newt.position._id;
          course.arrange.timeNPlace[preIndex].position.name = newt.position.name;

          var t = course.arrange.timeNPlace;
          course.arrange.timeNPlaceName = "";
          for (var i = 0; i < t.length; i++) {
            course.arrange.timeNPlaceName = course.arrange.timeNPlaceName + t[i].weekday.name + t[i].position.name + "   ";
          }

          course.save(function () {
            mongoose.connection.close();
            res.send(result);
          });
        }
      });
  });
});

function parseWeekPosition(weekdayId, positionId, classrome) {
  var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  var positions = ["第1,2节", "第3,4节", "第5,6节", "第7,8节", "第9,10节", "第11,12节"];
  var t = {};
  t.weekday = {};
  t.weekday._id = weekdayId;
  t.weekday.name = weeks[weekdayId];
  t.position = {};
  t.position._id = positionId;
  t.position.name = positions[positionId];
  t.classrome = classrome;
  return t;
}

module.exports = router;
