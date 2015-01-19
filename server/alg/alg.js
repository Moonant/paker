var express = require('express');
var mongoose = require('mongoose');
var Course = require('../models/course');
var Set = require('./set');
var algProcess = require('child_process').fork(__dirname + '/run.js');
var router = express.Router();
var connStr = 'mongodb://localhost:27017/packer';

console.log("pid:"+process.pid);

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.status(401).end();
    else
        next();
};


var courseArranged = [];

var packerStatus = {
    isPackering: false,
    process: 0,
    bestFitness: 0,
    conflicts: [],
    msg :""
};

algProcess.on('message', function (m) {
    //console.log(m.isAlgFinished);
    //console.log(m.packerStatus);
    if (m.isAlgFinished) {
        var pop = m.pop;
        packerStatus = m.packerStatus;
        var connStr = 'mongodb://localhost:27017/packer';
        mongoose.connect(connStr, function (err) {
            if (err) console.log(err);
        });

        var coursesTable = parseCourseModelTable(pop.courseRealIds, pop.bestIndividule.timeTable);

        Course.find({})
            .where('_id').in(pop.courseRealIds)
            .exec(function (err, docs) {
                for (var j = 0; j < docs.length; j++) {
                    var doc = docs[j];
                    doc.arrange.timeNPlace = coursesTable[doc._id].timeNPlace;
                    doc.arrange.timeNPlaceName = coursesTable[doc._id].timeNPlaceName;
                    doc.save();
                }
                mongoose.connection.close();
            });

    } else {
        packerStatus = m.packerStatus;
    }
});

function startPakering() {

    mongoose.connect(connStr, function (err) {
        if (err) console.log(err);
    });

    Course.find({})
        .exec(function (err, docs) {
            if (err) throw  err;
            var courseToArrange = parseCoursesToArrange(docs);

            //var pop = runPackerAlg();
            algProcess.send({'courseToArrange': courseToArrange, 'courseArranged': courseArranged});
            mongoose.connection.close();
        });
}

function parseCoursesToArrange(docs) {
    var teacherIds = new Set();
    var classesIds = new Set();
    var courseToArrange = [];
    for (var i in docs) {
        var course = docs[i];

        var c = {};
        c.id = course._id;
        c.weekNum = 2;
        if (!course.teacher._id) {
            continue;
        }
        c.teacherId = course.teacher._id;
        c.classesIds = [];
        for (var j = 0; j < course.classes.length; j++) {
            c.classesIds.push(course.classes[j]._id);
            //classesIds.add(course.classes[j]._id);
        }

        courseToArrange.push(c);
        //teacherIds.add(c.teacherId);
    }
    return courseToArrange ;
}

function parseCourseModelTable(courseIds, timeTable) {
    var coursesTable = {};
    var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var positions = ["第1,2节", "第3,4节", "第5,6节", "第7,8节", "第9,10节", "第11,12节"];
    for (var i in courseIds) {
        if (!coursesTable[courseIds[i]]) {
            coursesTable[courseIds[i]] = {};
            coursesTable[courseIds[i]].timeNPlace = [];
        }
        var t = {};
        t.weekday = {};
        t.weekday._id = timeTable[i].dayId + 1;
        t.weekday.name = weeks[t.weekday._id];
        t.position = {};
        t.position._id = timeTable[i].timeId;
        t.position.name = positions[t.position._id];
        coursesTable[courseIds[i]].timeNPlace.push(t);
    }
    for (var id in coursesTable) {
        var t = coursesTable[id].timeNPlace;
        coursesTable[id].timeNPlaceName = "";
        for (i in t) {
            coursesTable[id].timeNPlaceName = coursesTable[id].timeNPlaceName + t[i].weekday.name + t[i].position.name + "   ";
        }
    }
    return coursesTable;
}

router.get('/alg/packer', function (req, res) {
    if (packerStatus.isPackering) {
        packerStatus.msg ="正在排课请稍候重试";
        res.send(packerStatus);
    }
    packerStatus.isPackering = true;
    packerStatus.process = 0;
    packerStatus.bestFitness = 0;
    packerStatus.msg = "排课开始";
    startPakering();
    res.send(packerStatus);
});

router.get('/alg/packer/status', function (req, res) {
    res.send(packerStatus);
});


//Test:
//startPakering(0);

module.exports = router;