'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */

function MainCtrl($q, $resource, $scope, $location, $rootScope,
  $modal, Auth, Apartment, Major, Cls, Teacher, Course){

  $scope.user = new Auth();  
  $scope.user.$check();
  $scope.allCourses = true;
  $scope.classCourses = false;
  $scope.teacherCourses = false;

  // add classroom
  $scope.addClassroom = function(crsid) {
    var course = $scope.courses.filter(function(course) {
      return course._id === crsid;
    })[0];
    $modal.open({
      templateUrl: 'addClassroomDialog.html',
      controller: function($scope, $modalInstance) {
        $scope.course = course;
        $scope.ok = function() {
          var invalid = true;
          $scope.course.arrange.timeNPlace.forEach(function(timeNPlace) {
            if(timeNPlace.classroom !== '' && timeNPlace.classroom !== undefined) {
              invalid = false; 
            }
          });
          if(invalid) { return; }
          $scope.course.arrange.timeNPlaceName = '';
          $scope.course.arrange.timeNPlace.forEach(function(timeNPlace) {
            $scope.course.arrange.timeNPlaceName += timeNPlace.weekday.name;
            $scope.course.arrange.timeNPlaceName += timeNPlace.position.name;
            $scope.course.arrange.timeNPlaceName += timeNPlace.classroom + ' ';
          });
          var course = new Course();
          for(var attrname in $scope.course) {
            course[attrname] = $scope.course[attrname];
          }
          course.$update({ crsid: $scope.course._id }, function() {
            $modalInstance.close();
          });
        };
        $scope.cancel = function() {
          $modalInstance.dismiss();
        };
      },
      size: 'sm'
    });
  };

  // check box changed 
  $scope.changeCheckStatus = function(crsid) {
    var course = $scope.courses.filter(function(course) {
      return course._id === crsid;
    })[0];
    var updatedCourse = new Course();
    for(var attrname in course) {
      updatedCourse[attrname] = course[attrname];
    }
    updatedCourse.$update({ crsid: course._id }, function() {
    });
  };

  // start to manage 
  $scope.packer = function() {
    var Packer = $resource('/alg/packer');
    Packer.get(function(data) {
      if(data.isPackering !== true) { return; }
      var modalInstance = $modal.open({
        templateUrl: 'processDialog.html',
        controller: function($scope, $modalInstance) {
          $scope.ok =  function() {
            $modalInstance.close();
          };
          $scope.title = '自动排课中';
          $scope.tip = '处理进度';
          $scope.isButtonDisabled = true;
          var interval = setInterval(function() {
          var Status = $resource('/alg/packer/status');
          Status.get(function(data) {
            if(data.process === 1) {
              $scope.tip='排课完成, 冲突检测:' + data.conflicts; 
              $scope.isButtonDisabled = false;
              clearInterval(interval); 
            }
            $scope.processValue = data.process*100;
          });
          }, 30);
        },
        size: ''
      });
      modalInstance.result.then(function() {
        $scope.getCourses();
      });
    });
  };

  $scope.showAllCourses = function() {
    $scope.allCourses = true;
    $scope.classCourses = false;
  };
  $scope.shownCourses = [];
  $scope.showClassCourses = function(apartment, major, cls) {
    $scope.shownCourses = [
      { 
        name: '1-2',
        _id: 0,
        // contain a row courses
        courses: [ [], [], [], [], [] ]
      },
      {
        name: '3-4',
        _id: 1,
        courses: [ [], [], [], [], [] ]
      },
      {
        name: '5-6',
        _id: 2,
        courses: [ [], [], [], [], [] ]
      },
      {
        name: '7-8',
        _id: 3,
        courses: [ [], [], [], [], [] ]
      },
      {
        name: '9-10',
        _id: 4,
        courses: [ [], [], [], [], [] ]
      },
      {
        name: '11-12',
        _id: 5,
        courses: [ [], [], [], [], [] ]
      }
    ];
    $scope.allCourses = false;
    $scope.classCourses = true;

    $scope.shownClass = cls;
    $scope.shownApartment = apartment;
    $scope.shownMajor = major;
    var aptid = apartment._id;
    var mjid = major._id;
    var clsid = cls._id;

    // filt all the courses of specified class
    var filt = function(course) {
      if(!course.apartment ) {
        return false;
      }
      if(course.apartment._id !== aptid) { return false; }
      if(course.major._id !== mjid) { return false; }
      var cls = course.classes.filter(function(cls) {
        return cls._id === clsid;
      });
      return cls[0] !== undefined;
    };
    var courses = $scope.courses.filter(filt);
    courses.forEach(function(course) {
      for(var i=0; i<course.arrange.timeNPlace.length; i++) {
        var timeNPlace = course.arrange.timeNPlace[i];
        var c = {};
        c._id = course._id;
        c._tid = course.teacher._id;
        c.aptid = course.apartment._id;
        c.mjid = course.major._id;
        c.title = course.name;
        c.clsid = clsid;
        c.arrange = course.arrange;
        c.drag = true;
        c.preindex = i;
        $scope
          .shownCourses[timeNPlace.position._id]
          .courses[timeNPlace.weekday._id - 1]
          .push(c);
      }
    });
  };

  // check for conflict called every drop
  $scope.checkConflict = function(event, ui, rowIndex, columnIndex){
    var course = angular.element(ui.draggable).scope().course;
    var CheckConflict = $resource('courses/:crsid/checkconflict', 
      { crsid: '' },
      { update: {method: 'PUT'} });
    var updatedCourse = new CheckConflict();
    updatedCourse.weekday = columnIndex + 1;
    updatedCourse.position = rowIndex;
    updatedCourse.preindex = course.preindex;
    //console.dir(updatedCourse);
    updatedCourse.$update({ crsid: course._id }, function(data) {
      if(data.isConfict === true) {
        $modal.open({
          templateUrl: 'confirmDialog.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            msg: function() {
              return data.msg;
            }
          },
          size: 'sm'
        });
        $scope.shownCourses = [
          { 
            name: '1-2',
            _id: 0,
            // contain a row courses
            courses: [ [], [], [], [], [] ]
          },
          {
            name: '3-4',
            _id: 1,
            courses: [ [], [], [], [], [] ]
          },
          {
            name: '5-6',
            _id: 2,
            courses: [ [], [], [], [], [] ]
          },
          {
            name: '7-8',
            _id: 3,
            courses: [ [], [], [], [], [] ]
          },
          {
            name: '9-10',
            _id: 4,
            courses: [ [], [], [], [], [] ]
          },
          {
            name: '11-12',
            _id: 5,
            courses: [ [], [], [], [], [] ]
          }
        ];

        var aptid = course.aptid;
        var mjid = course.mjid;
        var clsid = course.clsid;

        // filt all the courses of specified class
        var filt = function(course) {
          if(!course.apartment ) {
            return;
          }
          if(course.apartment._id !== aptid) { return false; }
          if(course.major._id !== mjid) { return false; }
          var cls = course.classes.filter(function(cls) {
            return cls._id === clsid;
          });
          return cls[0] !== undefined;
        };
        var courses = $scope.courses.filter(filt);
        courses.forEach(function(course) {
          for(var i=0; i<course.arrange.timeNPlace.length; i++) {
            var timeNPlace = course.arrange.timeNPlace[i];
            var c = {};
            c._id = course._id;
            c._tid = course.teacher._id;
            c.aptid = aptid;
            c.mjid = mjid;
            c.clsid = clsid;
            c.title = course.name;
            c.arrange = course.arrange;
            c.drag = true;
            c.preindex = i;
            $scope
              .shownCourses[timeNPlace.position._id]
              .courses[timeNPlace.weekday._id - 1]
              .push(c);
          }
        });
      }
    });
    /*
    var checkTeacherConflict = function(row, column) {
      var teacherId = $scope.shownCourses[row].courses[column][0]._tid;
      var courses = $scope.courses.filter(function(course) {
        return course.teacher._id === teacherId;
      });
      var flag = false;
      courses.forEach(function(course) {
        course.arrange.timeNPlace.forEach(function(t) {
          var b = t.weekday._id === columnIndex + 1;
          b = b && t.position._id === rowIndex;
          if(b) { flag = true; }
        });
      });
      // teacher's schedule conflict
      if(flag) {
        $modal.open({
          templateUrl: 'confirmDialog.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            msg: function() {
              return '教师' + courses[0].teacher.name  + '上课时间发生冲突';
            }
          },
          size: 'sm'
        });
      }
    };
    $scope.shownCourses.forEach(function(row) {
      row.courses.forEach(function(courses) {
        if(courses.length >= 2) {
          // conflict
          $modal.open({
            templateUrl: 'confirmDialog.html',
            controller: 'ConfirmDialogCtrl',
              resolve: {
              msg: function() {
                return '班级上课时间发生冲突';
              }
            },
            size: 'sm'
          });
        }
      });
    });
    var isChanged = true;
    course.arrange.timeNPlace.forEach(function(timeNPlace) {
      var b = timeNPlace.weekday._id === columnIndex + 1;
      b = b && timeNPlace.position._id === rowIndex;
      if(b) { isChanged = false; }
    });
    if(isChanged) {
      checkTeacherConflict(rowIndex, columnIndex);
    }
    */
  };

  // apply for apartments' data
  $scope.getApartments = function() {
    var deferred = $q.defer();
    Apartment.get(function(data) {
      $scope.apartments = data.apartments;
      deferred.resolve();
    });
    return deferred.promise;
  };

  // apply for teachers' data
  $scope.getTeachers= function() {
    var deferred = $q.defer();
    Teacher.get(function(data) {
      $scope.teachers = data.teachers;
      deferred.resolve();
    });
    return deferred.promise;
  };

  // apply for grades' data
  $scope.getGrades = function() {
    var deferred = $q.defer();
    var Grade = $resource('/grades');
    Grade.get(function(data) {
      $scope.grades = data.grades;
      deferred.resolve();
    });
    return deferred.promise;
  };

  // apply for courses' data
  $scope.getCourses = function() {
    var deferred = $q.defer();
    Course.get(function(data) {
      $scope.courses = data.courses;
      //console.dir(data.courses);
      deferred.resolve();
    });
    return deferred.promise;
  };

  $scope
    .getApartments()
    .then($scope.getTeachers)
    .then($scope.getGrades)
    .then($scope.getCourses);

  // delete apartment 
  $scope.deleteApartment = function(aptid) {
    var deletedApartment = new Apartment();
    deletedApartment.$delete(
      { aptid: aptid }, 
      function() {
        $scope.getApartments();
      });
  };

  // delete a course
  $scope.deleteCourse = function(crsid) {
    var deletedCourse = new Course();
    deletedCourse.$delete(
      { crsid: crsid },
      function() {
        $scope.getCourses();
      });
  };

  // delete major
  $scope.deleteMajor = function(aptid, mjid) {
    var deletedMajor = new Major();
    deletedMajor.$delete(
      { aptid: aptid, mjid: mjid },
      function() {
        $scope.getApartments();
      });
  };

  // delete class
  $scope.deleteClass = function(aptid, mjid, clsid) {
    var deletedClass = new Cls();
    //console.log(clsid);
    deletedClass.$delete(
      { aptid: aptid, mjid: mjid, clsid: clsid },
      function() {
        $scope.getApartments();
      });
  };

  // delete teacher
  $scope.deleteTeacher = function(tid) {
    var deletedTeacher = new Teacher();
    //console.log(clsid);
    deletedTeacher.$delete(
      { tid: tid },
      function() {
        $scope.getTeachers();
      });
  };

  // for inside controllers to call
  $scope.getApartmentsValue = function() {
    return $scope.apartments;
  };

  // for inside controllers to call
  $scope.getTeachersValue = function() {
    return $scope.teachers;
  };

  // for inside controller to call
  $scope.getGradesValue = function() {
    return $scope.grades;
  };

  // for inside controller to call
  $scope.getCoursesValue = function() {
    return $scope.courses;
  };

  // add grade dialog
  $scope.addGradeDialog = function() {
    //console.log($scope.grades);
    var modalInstance = $modal.open({
      templateUrl: 'addGradeDialog.html',
      controller: 'AddGradeDialogCtrl',
      resolve: {
        grades: $scope.getGradesValue
      },
      size: 'sm'
    });
    modalInstance.result.then(function(gradeName) {
      var Grade = $resource('/grades');
      var grade = new Grade();
      grade.name = gradeName;
      grade.$save(function() {
        $scope.getGrades();
      });
    });
  };

  // add apartment dialog
  $scope.addApartmentDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'addApartmentDialog.html',
      controller: 'AddApartmentDialogCtrl',
      size: 'sm'
    });
    modalInstance
      .result
      .then(function(apartmentName) {
        if(apartmentName === '') {
          $modal.open({
            templateUrl: 'confirmDialog.html',
            controller: 'ConfirmDialogCtrl',
            resolve: {
              msg: function() {
                return '失败';
              }
            },
            size: 'sm'
          });
          return;
        }
        var apartment = new Apartment();
        apartment.name = apartmentName;
        apartment.$save(function(){
          $scope.getApartments();
        });
      });
  };

  // add teacher dialog
  $scope.addTeacherDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'addTeacherDialog.html',
      controller: 'AddTeacherDialogCtrl',
      resolve: {
        apartments: $scope.getApartmentsValue
      },
      size: 'sm'
    });
    modalInstance
      .result
      .then(function(teacherInfo) {
        var teacher = new Teacher();
        teacher.name = teacherInfo.name;
        teacher.apartment = teacherInfo.apartment; 
        //console.dir(teacher);
        teacher.$save(function() {
          $scope.getTeachers();
        });
      });
  };

  // add major dialog
  $scope.addMajorDialog = function(apartment) {
    var modalInstance = $modal.open({
      templateUrl: 'addMajorDialog.html',
      controller: 'AddMajorDialogCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function(majorName) {
      if(majorName === '') {
        $modal.open({
          templateUrl: 'confirmDialog.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            msg: function() {
              return '失败';
            }
          },
          size: 'sm'
        });
        return;
      }
      var newMajor = new Major();
      newMajor.major = { 
        name: majorName
      };
      newMajor.$save({ aptid: apartment._id }, function() {
          $scope.getApartments();
      });
    });
  };

  // add class dialog
  // apartment and major is passed by ng-clicked
  $scope.addClassDialog = function(apartment, major) {
    var modalInstance = $modal.open({
      templateUrl: 'addClassDialog.html',
      controller: 'AddClassDialogCtrl',
      resolve: {
        grades: $scope.getGradesValue
      },
      size: 'sm'
    });
    modalInstance.result.then(function(cls) {
      if(cls.name === '' || cls.grade._id === undefined) {
        $modal.open({
          templateUrl: 'confirmDialog.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            msg: function() {
              return '失败';
            }
          },
          size: 'sm'
        });
        return;
      }
      var newClass = new Cls();
      newClass.class = cls;
      newClass.$save({ aptid: apartment._id, mjid: major._id },
        function() {
          $scope.getApartments();
        }
      );
    });
  };

  // add course dialog
  $scope.addCourseDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'addCourseDialog.html',
      controller: 'AddCourseDialogCtrl',
      resolve: { 
        apartments: $scope.getApartmentsValue,
        teachers: $scope.getTeachersValue,
        grades: $scope.getGradesValue
      },
      size: 'lg'
    });
    modalInstance.result.then(function() {
      $scope.getCourses();
    });
  };

  // excel upload dialog called every upload clicked
  $scope.uploadExcelDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'uploadDialog.html',
      controller: 'UploadDialogCtrl',
      resolve: {
        apartments: $scope.getApartmentsValue
      },
      size: 'lg'
    });
    modalInstance.result.then(function() {
      $scope.getCourses();
    });
  };

  // excel download dialog called every upload clicked
  $scope.downloadExcelDialog = function() {
    $modal.open({
      templateUrl: 'outportDialog.html',
      controller: 'OutportDialogCtrl',
      resolve: {
        apartments: $scope.getApartmentsValue
      },
      size: 'lg'
    });
  };

  $scope.inputWeeks = function() {
    $modal.open({
      templateUrl: 'inputWeeks.html',
      controller: function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close();
        };
        $scope.cancel = function() {
          $modalInstance.dismiss();
        };
      },
      size: 'sm'
    });
  };

  // delete confirm
  $scope.confirmDeleteDialog = function(size) {
    $modal.open({
      templateUrl: 'confirmDialog.html',
      controller: 'ConfirmDialogCtrl',
      resolve: {
        msg: function() {
          return '确定删除?';
        }
      },
      size: size
    });
  };
  // Logout 
  $scope.logout = function(){
    Auth.logout();
    $location.url('/login');
  };

  // edit course
  $scope.editCourse = function(crsid) {
    $modal.open({
      templateUrl: 'editCourseDialog.html',
      controller: 'EditCourseDialogCtrl',
      resolve: {
        course: function() {
          var courses = $scope.getCoursesValue();
          var filt = function(course) {
            return course._id === crsid;
          };
          return courses.filter(filt)[0];
        },
        grades: $scope.getGradesValue,
        apartments: $scope.getApartmentsValue,
        teachers: $scope.getTeachersValue
      },
      size: 'lg'
    });
  };
}
MainCtrl.$inject = ['$q', '$resource', '$scope', '$location', '$rootScope', 
  '$modal', 'Auth', 'Apartment', 'Major', 'Cls', 'Teacher', 'Course'];

// EditCoureseDialogCtrl
function EditCourseDialogCtrl($scope, $modalInstance, Course, course, grades, apartments, teachers) {
  //console.dir(course);
  $scope.grades = grades;
  $scope.apartments = apartments;
  $scope.teachers = teachers;
  $scope.course = course;
  apartments.forEach(function(apt) {
    if(course.apartment === undefined) { return; }
    if(apt._id === course.apartment._id) { $scope.course.apartment = apt; }
  });
  if($scope.course.apartment !== undefined) {
    $scope.course.apartment.majors.forEach(function(mj) {
      if(mj._id === $scope.course.major._id) { $scope.course.major = mj; }
    });
  }
  var classes = [];
  if($scope.course.major !== undefined) {
    $scope.course.major.classes.forEach(function(cls) {
      $scope.course.classes.forEach(function(selectedCls) {
        if(selectedCls._id === cls._id) { cls.isSelected = true; }
      });
      classes.push(cls);
    });
  }
  $scope.classes = classes;
  grades.forEach(function(grade) {
    if($scope.course.grade === undefined) { return; }
    if(grade._id === $scope.course.grade._id) { $scope.course.grade = grade; }
  });

  // 4th section 
  $scope.tipHide = false;
  // select the grade specified classes 
  $scope.$watch('course.grade', function() {
    var filt = function(cls) {
      if(cls.grade === undefined) { return false; }
      return cls.grade._id === $scope.course.grade._id;
    };
    if($scope.course.major === undefined) { return; }
    if($scope.course.major.classes) {
      $scope.course.classes = $scope.course.major.classes.filter(filt);
      $scope.tipHide = true;
    }
  });

  // 5th section 
  $scope.isReadonly = false;

  // 6th section
  $scope.startweek = '';
  $scope.endweek = '';
  $scope.addWeekSec = function() {
    // start week and end week not blank
    if($scope.startweek === '' || $scope.endweek === '') { return; }
    var name = $scope.startweek + '周至' + $scope.endweek + '周';
    $scope.course.arrange.weekSecs.push({
      startweek: $scope.startweek,
      endweek: $scope.endweek,
      name: name 
    });
  };

  // 7th seciton
  $scope.weekdays = [
    { _id: 0, name: '星期天'},
    { _id: 1, name: '星期一'},
    { _id: 2, name: '星期二'},
    { _id: 3, name: '星期三'},
    { _id: 4, name: '星期四'},
    { _id: 5, name: '星期五'},
    { _id: 6, name: '星期六'}
  ];
  $scope.positions = [
    { _id: 0, name: '第1,2节'},
    { _id: 1, name: '第3,4节'},
    { _id: 2, name: '第5,6节'},
    { _id: 3, name: '第7,8节'},
    { _id: 4, name: '第9,10节'},
    { _id: 5, name: '第11,12节'}
  ];
  $scope.addTime = function() {
    if($scope.weekday.name === undefined || $scope.position.name === {}) {
      return; 
    }
    var name = $scope.weekday.name + $scope.position.name;
    $scope.course.arrange.timeNPlace.push({
      weekday: $scope.weekday,
      position: $scope.position,
      name: name
    });
    $scope.course.arrange.timeNPlaceName += name + ' ';
  };

  // 8th section 
  $scope.comOpts = [
    { isCompulsory: false, name: '选修' },
    { isCompulsory: true, name: '必修' }
  ];
  if($scope.course.type.isCompulsory){
    $scope.course.type = $scope.comOpts[1];
  }
  else {
    $scope.course.type = $scope.comOpts[1];
  }

  $scope.categories = [
    { _id: 0, name: '通识教育课程' },
    { _id: 1, name: '学科基础教程' }
  ];
  $scope.categories.forEach(function(cat) {
    if(cat._id === $scope.course.category._id) {
      $scope.course.category = cat;
    }
  });
  $scope.$watch('course.teacher._id', function() {
    var filt = function(item) {
      return item._id === parseInt($scope.course.teacher._id);
    };
    if($scope.course.teacher === undefined) { $scope.course.teacher = {}; }
    var teacher = $scope.teachers.filter(filt);
    if(teacher[0]) {
      $scope.course.teacher = teacher[0];
      $scope.isReadonly = true;
    }
    else {
      $scope.course.teacher.name = '';
      $scope.isReadonly = false;
    }
  });
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    //console.dir($scope.selectedApartment);
  };

  $scope.addCourse = function() {
    $scope.course.arrange.weekSecs.forEach(function(weekSec) {
      $scope.course.arrange.weeksName += weekSec.name + ' ';
    });
    var classes = [];
    $scope.course.classes.forEach(function(cls) {
      if(cls.isSelected) {
        classes.push(cls);
      }
    });
    $scope.course.classes = classes;
    $scope.course.classesName = '';
    $scope.course.classes.forEach(function(cls) {
      $scope.course.classesName += cls.name + ' ';
    });
    var course = new Course();
    for(var attrname in $scope.course) {
      course[attrname] = $scope.course[attrname];
    }
    course.$update({ crsid: $scope.course._id }, function() {
      $modalInstance.close();
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
EditCourseDialogCtrl.$inject = ['$scope', '$modalInstance', 'Course', 'course', 'grades', 'apartments', 'teachers'];

// Controller for add apartment dialog
function AddApartmentDialogCtrl($scope, $modalInstance) {
  $scope.apartmentName = '';
  $scope.ok = function() {
    $modalInstance.close($scope.apartmentName);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddApartmentDialogCtrl.$inject = ['$scope', '$modalInstance', 'course'];

// Controller for ConfirmDialog
function ConfirmDialogCtrl($scope, $modalInstance, msg) {
  $scope.msg = msg;
  $scope.ok = function() {
    $modalInstance.close();
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
ConfirmDialogCtrl.$inject = ['$scope', '$modalInstance', 'msg'];

// Controller for UploadDialog
function UploadDialogCtrl($scope, $modalInstance, $upload, $modal, apartments) {
  $scope.apartments = apartments;
  $scope.apartment = null;
  $scope.major = null;
  $scope.excelFile = null;
  $scope.upload = function(){
    if($scope.apartment === null || $scope.major === null) {
      return;
    }
    var file = $scope.excelFile[0];
    $scope.upload = $upload.upload({
      url: 'upload',
      method: 'POST',
      file: file
    }).success(function(data) {
      $modalInstance.close();
      if(data.status) {
        $modal.open({
          templateUrl: 'confirmDialog.html',
          controller: 'ConfirmDialogCtrl',
          data: { aptid: $scope.apartment._id, mjid: $scope.major._id},
          resolve: {
            msg: function() {
              return '上传成功!';
            }
          },
          size: 'sm'
        });
      }
    });
  };
  // *****
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
UploadDialogCtrl.$inject = ['$scope', '$modalInstance', '$upload', '$modal', 'apartments'];

// Controller for outport 
function OutportDialogCtrl($scope, $modalInstance, $upload, $modal, apartments) {
  $scope.apartments = apartments;
  $scope.apartment = null;
  $scope.major = null;
  // *****
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
OutportDialogCtrl.$inject = ['$scope', '$modalInstance', '$upload', '$modal', 'apartments'];

// Controller for add course dialog
function AddCourseDialogCtrl($scope, $modalInstance, Apartment, 
  apartments, teachers, grades, Course, $modal) {

  $scope.course = new Course();
  // data required, should resolve in enclosing scope
  $scope.grades = grades;
  $scope.apartments = apartments;
  $scope.teachers = teachers;

  // 1st section
  $scope.course.name = '';
  $scope.course.apartment = {};
  $scope.course.major = {};
  $scope.course.grade = {};

  // 2nd section 
  $scope.course.lectureHours = '';
  $scope.course.onlineHours = '';
  $scope.course.intermHours = '';

  // 3rd  section
  $scope.course.labHours = '';
  $scope.course.extracurricular = '';
  $scope.course.totalHours = '';

  // 4th section 
  $scope.tipHide = false;
  // select the grade specified classes 
  $scope.$watch('course.grade', function() {
    var filt = function(cls) {
      if(cls.grade === undefined) { return false; }
      return cls.grade._id === $scope.course.grade._id;
    };
    if($scope.course.major.classes) {
      $scope.course.classes = $scope.course.major.classes.filter(filt);
      $scope.tipHide = true;
    }
  });

  // 5th section 
  $scope.course.teacher = {};
  $scope.course.teacher._id = null;
  $scope.course.teacher = '';
  $scope.isReadonly = false;

  // 6th section
  $scope.startweek = '';
  $scope.endweek = '';
  $scope.course.arrange ={};
  $scope.course.arrange.weekSecs = [];
  $scope.addWeekSec = function() {
    // start week and end week not blank
    if($scope.startweek === '' || $scope.endweek === '') { return; }
    var name = $scope.startweek + '周至' + $scope.endweek + '周';
    $scope.course.arrange.weekSecs.push({
      startweek: $scope.startweek,
      endweek: $scope.endweek,
      name: name 
    });
  };

  // 7th seciton
  $scope.weekdays = [
    { _id: 0, name: '星期天'},
    { _id: 1, name: '星期一'},
    { _id: 2, name: '星期二'},
    { _id: 3, name: '星期三'},
    { _id: 4, name: '星期四'},
    { _id: 5, name: '星期五'},
    { _id: 6, name: '星期六'}
  ];
  $scope.positions = [
    { _id: 0, name: '第1,2节'},
    { _id: 1, name: '第3,4节'},
    { _id: 2, name: '第5,6节'},
    { _id: 3, name: '第7,8节'},
    { _id: 4, name: '第9,10节'},
    { _id: 5, name: '第11,12节'}
  ];
  $scope.weekday = {};
  $scope.position = {};
  $scope.course.arrange.timeNPlace = [];
  $scope.course.arrange.timeNPlaceName = '';
  $scope.addTime = function() {
    if($scope.weekday.name === undefined || $scope.position.name === {}) {
      return; 
    }
    var name = $scope.weekday.name + $scope.position.name;
    $scope.course.arrange.timeNPlace.push({
      weekday: $scope.weekday,
      position: $scope.position,
      name: name
    });
    $scope.course.arrange.timeNPlaceName += name + ' ';
  };

  // 8th section 
  $scope.comOpts = [
    { isCompulsory: false, name: '选修' },
    { isCompulsory: true, name: '必修' }
  ];
  $scope.course.type = {};
  $scope.categories = [
    { _id: 0, name: '通识教育课程' },
    { _id: 1, name: '学科基础教程' }
  ];
  $scope.course.category = {};
  $scope.$watch('course.teacher._id', function() {
    var filt = function(item) {
      return item._id === parseInt($scope.course.teacher._id);
    };
    var teacher = $scope.teachers.filter(filt);
    if(teacher[0]) {
      $scope.course.teacher = teacher[0];
      $scope.isReadonly = true;
    }
    else {
      $scope.course.teacher.name = '';
      $scope.isReadonly = false;
    }
  });
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    //console.dir($scope.selectedApartment);
  };

  $scope.addCourse = function() {
    var invalid = $scope.course.name === '';
    invalid = invalid || $scope.course.grade._id === undefined;
    invalid = invalid || $scope.course.type.isCompulsory === undefined;
    invalid = invalid || $scope.course.intermHours === '';
    invalid = invalid || $scope.course.teacher._id === '';
    invalid = invalid || $scope.course.teacher.name ==='';
    invalid = invalid || $scope.course.classes === undefined;
    if(invalid) { 
      $modal.open({
        templateUrl: 'confirmDialog.html',
        controller: 'ConfirmDialogCtrl',
        resolve: {
          msg: function() {
            return '必填项为空';
          }
        },
        size: 'sm'
      });
      return;
    }
    $scope.course.arrange.weeksName = '';
    $scope.course.isChecked = false;
    $scope.course.arrange.weekSecs.forEach(function(weekSec) {
      $scope.course.arrange.weeksName += weekSec.name + ' ';
    });
    var classes = [];
    $scope.course.classes.forEach(function(cls) {
      if(cls.isSelected) {
        classes.push(cls);
      }
    });
    $scope.course.classes = classes;
    $scope.course.classesName = '';
    $scope.course.classes.forEach(function(cls) {
      $scope.course.classesName += cls.name + ' ';
    });
    $scope.course.$save(function() {
      $modalInstance.close();
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddCourseDialogCtrl.$inject = ['$scope', '$modalInstance', 'Apartment',
  'apartments', 'teachers', 'grades', 'Course', '$modal'];

// Controller for add apartment dialog
function AddApartmentDialogCtrl($scope, $modalInstance) {
  $scope.apartmentName = '';
  $scope.ok = function() {
    $modalInstance.close($scope.apartmentName);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddApartmentDialogCtrl.$inject = ['$scope', '$modalInstance'];

// Controller for add major dialog
function AddMajorDialogCtrl($scope, $modalInstance) {
  $scope.majorName = '';
  $scope.ok = function() {
    $modalInstance.close($scope.majorName);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddApartmentDialogCtrl.$inject = ['$scope', '$modalInstance'];

// Controller for add class dialog
function AddClassDialogCtrl($scope, $modalInstance, grades) {
  $scope.grades = grades;
  $scope.selectedGrade = {};
  $scope.className= '';
  $scope.ok = function() {
    var cls = {
      name: $scope.className,
      grade: {
        _id: $scope.selectedGrade._id,
        name: $scope.selectedGrade.name
      }
    };
    $modalInstance.close(cls);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddClassDialogCtrl.$inject = ['$scope', '$modalInstance', 'grades'];

// Controller for add grade dialog
function AddGradeDialogCtrl($scope, $resource, $modalInstance, grades) {
  // delete grade
  $scope.deleteGrade = function(gid) {
    var Grade = $resource('/grades/:gid');
    var deletedGrade = new Grade();
    deletedGrade.$delete({ gid: gid });
    var filt = function(grade) {
      return grade._id !== gid;
    };
    $scope.grades = $scope.grades.filter(filt);
  };

  $scope.gradeName= '';
  $scope.grades = grades;
  $scope.ok = function() {
    $modalInstance.close($scope.gradeName);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddGradeDialogCtrl.$inject = ['$scope', '$resource', '$modalInstance', 'grades'];

// Controller for add teacher dialog
function AddTeacherDialogCtrl($scope, $modalInstance, apartments) {
  $scope.apartments = apartments;
  $scope.teacherName = '';
  $scope.apartment = {};
  $scope.ok = function() {
    var teacher = {
      name: $scope.teacherName,
      apartment: {
        name: $scope.apartment.name,
        _id: $scope.apartment._id
      }
    };
    $modalInstance.close(teacher);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddTeacherDialogCtrl.$inject = ['$scope', '$modalInstance', 'apartments'];

var dependences = ['authenticationServices', 'apartmentServices',
  'teacherServices', 'courseServices', 'ngDragDrop', 'angularFileUpload'];
angular.module('mainControllers', dependences)
  .controller('MainCtrl', MainCtrl)
  .controller('ConfirmDialogCtrl', ConfirmDialogCtrl)
  .controller('UploadDialogCtrl', UploadDialogCtrl)
  .controller('AddCourseDialogCtrl', AddCourseDialogCtrl)
  .controller('AddApartmentDialogCtrl', AddApartmentDialogCtrl)
  .controller('AddMajorDialogCtrl', AddMajorDialogCtrl)
  .controller('AddClassDialogCtrl', AddClassDialogCtrl)
  .controller('AddTeacherDialogCtrl', AddTeacherDialogCtrl)
  .controller('AddGradeDialogCtrl', AddGradeDialogCtrl)
  .controller('OutportDialogCtrl', OutportDialogCtrl)
  .controller('EditCourseDialogCtrl', EditCourseDialogCtrl);
