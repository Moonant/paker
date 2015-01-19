var Individule = function (pConfig, pCourses, pCoursesIds, pCoursesArranged, pTeacherIds, pClassesIds) {

  this.chomesome = "";
  this.fitness = 0;

  this.pConfig = pConfig;
  this.pCourses = pCourses;
  this.pCoursesIds = pCoursesIds;
  this.pCoursesArranged = pCoursesArranged;
  this.pTeacherIds = pTeacherIds;
  this.pClassesIds = pClassesIds;


  this.timeTable = [];
  this.teacherTables = [];
  this.classesTables = [];
  this.coursesTables = [];

  this.conflicts;

  this.initTables();
};

Individule.prototype.setRandomChomesome = function () {
  for (var i = 0; i < this.pConfig.geneNum; i++) {
    var item = {};
    item.dayId = parseInt(this.pConfig.pday * Math.random());
    item.timeId = parseInt(this.pConfig.ptime * Math.random());
    this.timeTable.push(item);
  }

  this.enCode();
};

Individule.prototype.enCode = function () {
  this.chomesome = "";
  for (var i in this.timeTable) {
    var c = this.timeTable[i].dayId * this.pConfig.ptime + this.timeTable[i].timeId;
    this.chomesome += this.padStr(c.toString(2), this.pConfig.genuLength);
  }
};

Individule.prototype.deCode = function () {
  this.timeTable = [];
  for (var i = 0; i < this.pConfig.geneNum; i++) {
    var item = {};
    var gene = this.chomesome.substr(i * this.pConfig.genuLength, this.pConfig.genuLength);
    var c = parseInt(gene, 2);

    if (c >= this.pConfig.pday * this.pConfig.ptime) {
      this.mutateSingleBit(i * this.pConfig.genuLength);
      c = parseInt(gene.substr(1, this.pConfig.genuLength - 1), 2);
    }

    item.dayId = parseInt(c / this.pConfig.ptime);
    item.timeId = parseInt(c % this.pConfig.ptime);
    this.timeTable.push(item);
  }
};

Individule.prototype.getInitTable = function () {
  var r = [];
  for (var i = 0; i < this.pConfig.pday; i++) {
    r[i] = [];
    for (var j = 0; j < this.pConfig.ptime; j++) {
      r[i][j] = '-';
    }
  }
  return r;
};
Individule.prototype.clearTable = function (r) {
  for (var i = 0; i < this.pConfig.pday; i++) {
    for (var j = 0; j < this.pConfig.ptime; j++) {
      r[i][j] = '-';
    }
  }
};

Individule.prototype.initTables = function () {
  for (var i = 0; i < this.pTeacherIds.length; i++) {
    this.teacherTables[i] = this.getInitTable();
  }
  for (i = 0; i < this.pClassesIds.length; i++) {
    this.classesTables[i] = this.getInitTable();
  }

  this.coursesTables = [];
};
Individule.prototype.clearTable = function (r) {
  for (var i = 0; i < this.pConfig.pday; i++) {
    for (var j = 0; j < this.pConfig.ptime; j++) {
      r[i][j] = '-';
    }
  }
};
Individule.prototype.clearTables = function () {
  for (var i = 0; i < this.pTeacherIds.length; i++) {
    this.clearTable(this.teacherTables[i]);
  }
  for (i = 0; i < this.pClassesIds.length; i++) {
    this.clearTable(this.classesTables[i]);
  }

  var course;
  for (i in this.pCoursesArranged) {
    course = this.pCoursesArranged[i];
    for (var j in course.ptime) {
      this.teacherTables[course.teacherId][course.ptime[j].dayId][course.ptime[j].timeId] = course.courseId;
      for (var z in course.classIds) {
        this.classesTables[course.classIds[z]][course.ptime[j].dayId][course.ptime[j].timeId] = course.courseId;
      }

    }
  }

  this.coursesTables = [];
};


Individule.prototype.isConflict = function (obj, x, y, z, courseId) {
  if (obj[x][y][z] != '-') {
    obj[x][y][z] = obj[x][y][z] + "-" + courseId;
    return true;
  } else {
    obj[x][y][z] = '' + courseId;
    return false;
  }
};

Individule.prototype.mutateSingleBit = function (i) {
  var c = this.chomesome.charAt(i);
  if (c == '1') {
    this.chomesome = this.chomesome.substring(0, i) + '0' + this.chomesome.substring(i + 1, this.pConfig.chromeLength);
  } else {
    this.chomesome = this.chomesome.substring(0, i) + '1' + this.chomesome.substring(i + 1, this.pConfig.chromeLength);
  }
};

Individule.prototype.pad = function (num, n) {
  var len = num.toString().length;
  while (len < n) {

    num = "0" + num;
    len++;
  }

  return num;
};

Individule.prototype.padStr = function (str, n) {
  var len = str.length;
  while (len < n) {

    str = "0" + str;
    len++;
  }

  return str;
};

Individule.prototype.calFitness = function () {
  this.deCode();
  this.clearTables();

  var tea = 0, clas = 0, clasDay = 0, night = 0;

  for (var i = 0; i < this.pConfig.geneNum; i++) {
    var courseId = this.pCoursesIds[i];
    var teacherId = this.pCourses[courseId].teacherId;
    var classesIds = this.pCourses[courseId].classesIds;
    var dayId = this.timeTable[i].dayId;
    var timeId = this.timeTable[i].timeId;

    if (timeId > 3) {
      night++;
    }

    if (this.isConflict(this.teacherTables, teacherId, dayId, timeId, courseId)) {
      tea++;
    }

    for (var j in classesIds) {
      if (this.isConflict(this.classesTables, classesIds[j], dayId, timeId, courseId)) {
        clas++;
      }
    }

    if (this.coursesTables[courseId]) {
      var t = {};
      t.dayId = dayId;
      t.timeId = timeId;

      for (var j in this.coursesTables[courseId]) {
        var day = Math.abs(this.coursesTables[courseId][j].dayId - t.dayId);
        if (day == 0) {
          clasDay += 2;
        } else if (day == 1) {
          clasDay++;
        }
      }

      this.coursesTables[courseId].push(t);

    } else {
      this.coursesTables[courseId] = [];
      this.coursesTables[courseId][0] = {};
      this.coursesTables[courseId][0].dayId = dayId;
      this.coursesTables[courseId][0].timeId = timeId;
    }
  }

  this.fitness = 1 / (1 + 2 * tea + 2 * clas + 0.1 * clasDay + 0.02 * night);

  this.conflicts = [tea, clas, clasDay, night];

  return this.fitness;
};

module.exports = Individule;