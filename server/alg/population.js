var Set = require("./set");
var Individule = require("./individule");
/*
var courses = [
    {id: 12, weekNum: 2, teacherId: 1, classesIds: [0, 1]}
];

var coursesArranged = [
    {
        id: 12,
        teacherId: 1,
        classesIds: [0, 1],
        time: [{dayId: 1, timeId: 3},
            {dayId: 1, timeId: 3}]
    }
];

*/

var Population = function (courses, courseArranged) {
    this.generation = 0;

    this.individules = [];
    this.childPop = [];

    this.bestFitness = 0;
    this.bestIndividule;
    this.currentIndividule;
    this.currentbestFitness = 0;
    this.currentallFitness = 0;


    this.pTeacherIds = new Set();
    this.pClassesIds = new Set();

    this.pCourses = [];
    this.pCoursesIds = [];
    this.pCoursesArranged = [];

    this.courseRealIds = [];

    for (var i=0; i<courses.length; i++) {
        var c = courses[i];
        for (var j = 0; j < c.weekNum; j++) {
            this.pCoursesIds.push(i);
            this.courseRealIds.push(c.id);
        }

        var tid = this.pTeacherIds.add(c.teacherId);
        var cids = [];
        for (j in c.classesIds) {
            cids.push(this.pClassesIds.add(c.classesIds[j]));
        }

        this.pCourses.push({teacherId: tid, classesIds: cids});
    }

    for (i in courseArranged) {
        c = courseArranged[i];

        tid = this.pTeacherIds.add(c.teacherId);
        cids = [];
        for (j in c.classesIds) {
            cids.push(this.pClassesIds.add(c.classesIds[j]));
        }
        this.pCoursesArranged.push({
            courseId: c.id,
            teacherId: tid,
            classIds: cids,
            ptime: c.time
        });
    }

    this.pConfig = {
        geneNum: this.pCoursesIds.length,
        genuLength: 5,
        chromeLength:this.pCoursesIds.length*6,
        pweek: 21,
        pday: 5,
        ptime: 6,
        size: 150,
        crossoverRate: 0.8,
        mutateRate: 0.002
    }
};

Population.prototype.initPoputation = function () {
    for (var i = 0; i < this.pConfig.size; i++) {
        this.individules[i] = new Individule(this.pConfig,
            this.pCourses, this.pCoursesIds, this.pCoursesArranged,
            this.pTeacherIds,this.pClassesIds);

        this.childPop[i] = new Individule(this.pConfig,
            this.pCourses, this.pCoursesIds, this.pCoursesArranged,
            this.pTeacherIds,this.pClassesIds);
        this.individules[i].setRandomChomesome();

    }
};

Population.prototype.selectIndivi = function () {
    var wheelFitness = [];
    this.currentallFitness = 0;
    this.currentbestFitness = 0;
    for (var i in this.individules) {
        var fitness = this.individules[i].calFitness();

        if (this.currentbestFitness < fitness) {
            this.currentbestFitness = fitness;
            this.currentIndividule = this.individules[i];
        }

        this.currentallFitness += fitness;
        wheelFitness[i] = this.currentallFitness;
    }

    if (this.bestFitness < this.currentbestFitness) {
        this.bestFitness = this.currentbestFitness;
        this.bestIndividule = this.currentIndividule;
    }

    for (i = 0; i < this.pConfig.size; i++) {
        var f = this.currentallFitness * Math.random();
        for (var j = 0; j < this.pConfig.size; j++) {
            if (f < wheelFitness[j]) {
                this.childPop[i].chomesome = this.individules[j].chomesome;
                //console.log(this.childPop[i].chomesome.slice(0,50));
                break;
            }
        }
    }
    for (i = 0; i < this.pConfig.size; i++) {
        this.individules[i].chomesome = this.childPop[i].chomesome;
    }
};

Population.prototype.crossOver = function () {
    for (var i = 0; i < this.pConfig.size - 1; i += 2) {

        var rnd = parseInt((this.pConfig.size - i) * Math.random()) + i;

        if (rnd != i)
            this.exchange(i, rnd);

        rnd = parseInt((this.pConfig.size - i) * Math.random()) + i;
        if (rnd != i + 1)
            this.exchange(i + 1, rnd);

        rnd = Math.random();

        if (rnd < this.pConfig.crossoverRate) {
            this.cross(i);
        }
    }
};

Population.prototype.exchange = function (x, y) {
    var tmp = this.individules[x];
    this.individules[x] = this.individules[y];
    this.individules[y] = tmp;
};

Population.prototype.cross = function (i) {
    var rnd = parseInt(this.pConfig.chromeLength * Math.random());
    var c1 = this.individules[i].chomesome.slice(0, rnd);
    var c2 = this.individules[i].chomesome.slice(rnd, this.pConfig.chromeLength);
    var c3 = this.individules[i + 1].chomesome.slice(0, rnd);
    var c4 = this.individules[i + 1].chomesome.slice(rnd, this.pConfig.chromeLength);

    this.individules[i].chomesome = c1 + c4;
    this.individules[i + 1].chomesome = c3 + c2;
};

Population.prototype.mutate = function () {

    for (var i = 0; i < this.pConfig.size; i++) {
        for (var j = 0; j < this.pConfig.chromeLength; j++) {
            if (Math.random() < this.pConfig.mutateRate) {
                this.individules[i].mutateSingleBit(j);
            }
        }
    }
};

Population.prototype.evolve = function () {
    this.selectIndivi();
    this.crossOver();
    this.mutate();
    this.generation++;
};

module.exports = Population;