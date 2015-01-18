var express = require('express');
var mongoose = require('mongoose');
var Course = require('../classes/course');
var Set = require('./Set');
var router = express.Router();

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.status(401).end();
    else
        next();
};

var courseToArrange = [];
var teacherIds = new Set();
var classesIds = new Set();

router.get('/alg/packer/apartment/:aptid', auth, function (req, res) {

    var connStr = 'mongodb://localhost:27017/packer';
    var aptid = req.params.aptid;
    mongoose.connect(connStr, function (err) {
        if (err) console.log(err);
    });

    Course.find({})
        .where('apartment._id').equals(aptid)
        .exec(function (err, docs) {
            for (var i in docs) {
                var course = docs[i];

                if (course.isArranged) {
                    continue;
                }

                var c = {};
                c.id = course._id;
                c.weekNum = 2;
                c.teacherId = course.teacher._id;
                c.classesIds = course.classesIds;
                courseToArrange.push(c);

                teacherIds.add(c.teacherId);
                for(var j in c.classesIds){
                    classesIds.add(c.classesIds[j]);
                }

            }
        });

});