var xlsx = require('node-xlsx');
var express = require('express');
var mongoose = require('mongoose');
var Course = require('../models/course');
var router = express.Router();


function parseXlsx(filename, res) {
  var result = {};
  try {
    result.status = true;
    result.obj = xlsx.parse(filename); // parses a file
    addCoursesToDB(result, res);
  } catch (e) {
    result.status = false;
    if (result.msg)
      result.msg = "文件格式应该为.xlsx";
    res.send(result);
  }
  return result;
}

function addCoursesToDB(result, res) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('delete major' + err);
  });
  var obj = result.obj[0];
  var newCourses = [];
  try {
    for (var i = 3; i < obj.data.length - 2; i++) {
      var c = obj.data[i];
      var newCourse = new Course();
      newCourse.name = c[0];
      newCourse.type = {};
      newCourse.type.isCompulsory = (c[1] == "必修");
      newCourse.type.name = c[1];
      newCourse.category.name = c[2];
      newCourse.onlineHours = c[5];
      newCourse.lectureHours = c[4];
      newCourse.intermHours = c[8];
      newCourse.labHours = c[6];
      newCourse.extracurricular = c[7];
      newCourse.totalHours = c[3];
      //newCourse.save();
      newCourses.push(newCourse);
    }
  } catch (e) {
    console.log(e);
    result.msg = "文件内排版有误";
    result.status = false;
  }
  Course.create(newCourses, function () {
    mongoose.connection.close();
    res.send(result);
  });

}

function getXlsxData(docs) {
  //return xlsx.parse(__dirname + '/out.xlsx');

  var data = [];
  data[0] = [];
  data[0][1] = "华中科技大学";
  data[1] = ["周 次", null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  data[2] = ["教学进程", null, "上    课", null, null, null, null, null, null, null, null, null, null, null, "考 试", "上    课", null, null, null, null, null, null, null, "考试"];
  data[3] = ["课程名称", null];
  data[4] = ["学时数", null];
  data[5] = ["学 分", null];

  for (var i = 6; i < 11; i++) {
    data[i] = [];
    for (var j = 0; j < 6; j++) {
      data[i][j] = "";
      for (var z = 0; z < docs.length; z++) {
        var t = docs[z].arrange.timeNPlace;
        for (var x = 0; x < t.length; x++) {
          if (t[x].weekday._id == i - 5 && t[x].position._id == j) {
            var c = docs[z].name + docs[z].arrange.timeNPlaceName;
            data[i][j] += c;
          }
        }
      }
    }
  }
  return data;
}

function buildXlsx(aptid, res) {
  var result = {status: false};
  var fs = require('fs');
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('delete major' + err);
  });
  Course.find({'apartment._id': aptid}, function (err, docs) {
    var data = getXlsxData(docs);
    var buffer = xlsx.build([{name: "课表", data: data}]); // returns a buffer
    var filename = __dirname + 'outtable.xlsx';
    fs.writeFileSync(filename, buffer, 'binary');
    result.filename = filename;
    result.status = true;
    res.send(result);
    mongoose.connection.close();
  });
}


// Test
//router.get('/xlsx/parse', function (req, res) {
//  res.send(parseXlsx());
//});

router.get('/xlsx/build/:aptid', function (req, res) {
  buildXlsx(aptid, res);
});


//var obj = xlsx.parse(fs.readFileSync(__dirname + '/myFile.xlsx')); // parses a buffer
//
//var xlsx = require('node-xlsx');
//
//var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
//var buffer = xlsx.build([{name: "mySheetName", data: data}]); // returns a buffer

router.parseXlsx = parseXlsx;

module.exports = router;
