var xlsx = require('node-xlsx');
var express = require('express');
var mongoose = require('mongoose');
var Course = require('../models/course');
var router = express.Router();


function parseXlsx(filename) {
  var result = {};
  try {
    result.obj = xlsx.parse(__dirname + '/plan.xlsx'); // parses a file
    addCoursesToDB(result);
    result.status = true;
  } catch (e) {
    result.status = false;
    if (result.msg)
      result.msg = "文件格式应该为.xlsx";
  }
  return result;
}

function addCoursesToDB(result) {
  var connStr = 'mongodb://localhost:27017/packer';
  mongoose.connect(connStr, function (err) {
    if (err) console.log('delete major' + err);
  });
  var obj = result.obj[0];
  try {
    for (var i = 3; i < obj.data.length - 2; i++) {
      var c = obj.data[i];
      var newCourse = new Course();
      newCourse.name = c[0];
      newCourse.classesName = c[0];
      newCourse.type = {};
      newCourse.type.isCompulsory = (c[1] == "必修");
      newCourse.type.name = c[2];
      newCourse.onlineHours = c[5];
      newCourse.lectureHours = c[4];
      newCourse.intermHours = c[8];
      newCourse.labHours = c[6];
      newCourse.extracurricular = c[7];
      newCourse.totalHours = c[3];
      newCourse.save();
    }
  } catch (e) {
    console.log(e);
    result.msg = "文件内排版有误";
    result.status = false;
  }

  mongoose.connection.close();
}


// Test
router.get('/xlsx', function (req, res) {
  res.send(parseXlsx());
});

//var obj = xlsx.parse(fs.readFileSync(__dirname + '/myFile.xlsx')); // parses a buffer
//
//var xlsx = require('node-xlsx');
//
//var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
//var buffer = xlsx.build([{name: "mySheetName", data: data}]); // returns a buffer


module.exports = router;
