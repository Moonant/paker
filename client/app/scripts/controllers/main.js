'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */

function MainCtrl($q, $resource, $scope, $location, 
  $modal, Auth, Apartment, Major, Cls, Teacher){

  $scope.user = new Auth();  
  $scope.user.$check();

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

  $scope
    .getApartments()
    .then($scope.getTeachers)
    .then($scope.getGrades);

  $scope.courses = [
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 2,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 3,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    },
    {
      id: 1,
      name: '信息论基础',
      teacher: '张三',
      apartment: '电信学院',
      major: '电子信息工程',
      time: '周三78节 周五12节'
    }
  ];

  // delete apartment 
  $scope.deleteApartment = function(aptid) {
    var deletedApartment = new Apartment();
    deletedApartment.$delete(
      { aptid: aptid }, 
      function() {
        $scope.getApartments();
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
    $modal.open({
      templateUrl: 'addCourseDialog.html',
      controller: 'AddCourseDialogCtrl',
      resolve: { 
        apartments: $scope.getApartmentsValue,
        teachers: $scope.getTeachersValue,
        grades: $scope.getGradesValue
      },
      size: 'lg'
    });
  };
  // excel upload dialog called every upload clicked
  $scope.uploadExcelDialog = function() {
    $modal.open({
      templateUrl: 'uploadDialog.html',
      controller: 'UploadDialogCtrl',
      size: 'lg'
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
  // When the title of a course if clicked
  // Edit course
  $scope.editCourse = function(id) {
    $modal.open({
      templateUrl: 'editDialog.html',
      controller: 'EditCourseDialogCtrl',
      size: 'lg'
    });
    console.log(id);
  };
}
MainCtrl.$inject = ['$q', '$resource', '$scope', '$location', '$modal',
  'Auth', 'Apartment', 'Major', 'Cls', 'Teacher'];

// EditCoureseDialogCtrl
function EditCourseDialogCtrl($scope, $modalInstance) {
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
EditCourseDialogCtrl.$inject = ['$scope', '$modalInstance'];

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
function UploadDialogCtrl($scope, $modalInstance) {
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
UploadDialogCtrl.$inject = ['$scope', '$modalInstance'];

// Controller for add course dialog
function AddCourseDialogCtrl($scope, $modalInstance, Apartment, 
  apartments, teachers, grades, Course) {

  // data required, should resolve in enclosing scope
  $scope.grades = grades;
  $scope.apartments = apartments;
  $scope.teachers = teachers;

  // 1st section
  $scope.courseName = '';
  $scope.selectedApartment = {};
  $scope.selectedMajor = {};
  $scope.selectedGrade = {};

  // 2nd section 
  $scope.lectureHours = '';
  $scope.onlineHours = '';
  $scope.intermHours = '';

  // 3rd  section
  $scope.labHours = '';
  $scope.extracurricular = '';
  $scope.totalHours = '';

  // 4th section 
  $scope.tipHide = false;
  // select the grade specified classes 
  $scope.$watch('selectedGrade', function() {
    var filt = function(cls) {
      if(cls.grade === undefined) { return false; }
      return cls.grade._id === $scope.selectedGrade._id;
    };
    if($scope.selectedMajor.classes) {
      $scope.classes = $scope.selectedMajor.classes.filter(filt);
      $scope.tipHide = true;
    }
  });

  // 5th section 
  $scope.teacherId = null;
  $scope.teacherName = '';
  $scope.isReadonly = false;

  // 6th section
  $scope.startweek = '';
  $scope.endweek = '';
  $scope.weekSecs = [];
  $scope.addWeekSec = function() {
    // start week and end week not blank
    if($scope.startweek === '' || $scope.endweek === '') { return; }
    var name = $scope.startweek + '周至' + $scope.endweek + '周';
    $scope.weekSecs.push({
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
  $scope.times = [];
  $scope.weekday = {};
  $scope.position = {};
  $scope.addTime = function() {
    if($scope.weekday.name === undefined || $scope.position.name === {}) {
      return; 
    }
    var name = $scope.weekday.name + $scope.position.name;
    $scope.times.push({
      weekday: $scope.weekday,
      position: $scope.position,
      name: name
    });
  };

  // 8th section 
  $scope.isCompulsory = false;
  $scope.selectedCategory = {};
  $scope.selectedCom = {};
  $scope.comOpts = [
    { _id: '0', name: '选修' },
    { _id: '1', name: '必修' }
  ];
  $scope.categories = [
    { _id: 0, name: '通识教育课程' },
    { _id: 1, name: '学科基础教程' }
  ];
  $scope.changeIsCompulsory = function() {
    if($scope.selectedCom._id+'' === '0') { $scope.isCompulsory = false; }
    else { $scope.isCompulsory = true; }
  };

  $scope.$watch('teacherId', function() {
    var filt = function(item) {
      return item._id === parseInt($scope.teacherId);
    };
    var teacher = $scope.teachers.filter(filt);
    if(teacher[0]) {
      $scope.teacherName = teacher[0].name;
      $scope.isReadonly = true;
    }
    else {
      $scope.teacherName = '';
      $scope.isReadonly = false;
    }
  });
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    //console.dir($scope.selectedApartment);
  };

  $scope.addCourse = function() {
    //console.log($scope.courseName);//
    //console.dir($scope.selectedApartment);//
    //console.dir($scope.selectedMajor);//
    //console.dir($scope.selectedGrade);//
    //console.log($scope.lectureHours);//
    //console.log($scope.onlineHours);
    //console.log($scope.intermHours + ';' + $scope.labHours + 
    //  $scope.extracurricular + $scope.totalHours);
    //console.dir($scope.classes);//
    //console.log($scope.teacherName+$scope.teacherId);//
    //console.dir($scope.weekSecs);//
    //console.dir($scope.times);//
    //console.log($scope.isCompulsory);//
    //console.dir($scope.selectedCategory);
    var course = new Course();
    course.name = $scope.courseName;
    course.apartment = {};
    course.apartment._id = $scope.selectedApartment._id;
    course.apartment.name = $scope.selectedApartment.name;
    course.major = {};
    course.major._id = $scope.selectedMajor._id;
    course.major.name = $scope.selectedMajor.name;
    course.grade = {};
    course.grade._id = $scope.selectedGrade._id;
    course.grade.name = $scope.selectedGrade.name;
    course.lectureHours = $scope.lectureHours;
    course.onlineHours = $scope.onlineHours;
    course.intermHours = $scope.intermHours;
    course.labHours = $scope.labHours;
    course.extracurricular = $scope.extracurricular;
    course.totalHours = $scope.totalHours;

    // fiter to filt the selected classes
    var filt = function(cls) {
      if(cls.isSelected === undefined) { return false; }
      return cls.isSelected;
    };
    if($scope.classes !== undefined) {
      course.classes = $scope.classes.filter(filt);
    }
    course.teacher = {};
    course.teacher._id = $scope.teacherId;
    course.teacher.name = $scope.teacherName;
    course.arrange = {};
    course.arrange.weeks = [];
    course.arrange.timeNPlace = [];

    // push week number into course.arrange.weeks 
    // according to the weekSecs
    $scope.weekSecs.forEach(function(weekSec) {
      var start = parseInt(weekSec.startweek);
      var end = parseInt(weekSec.endweek);
      for(var i=start; i<=end; i++) {
        course.arrange.weeks.push(i);
      }
    });
    // push time into timeNPlace
    $scope.times.forEach(function(time) {
      course.arrange.timeNPlace.push(time);
    });
    course.isCompulsory = $scope.isCompulsory;
    course.category = $scope.selectedCategory;
    course.$save();
    $modalInstance.close();
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
AddCourseDialogCtrl.$inject = ['$scope', '$modalInstance', 'Apartment',
  'apartments', 'teachers', 'grades', 'Course'];

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
  'teacherServices', 'courseServices'];
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
  .controller('EditCourseDialogCtrl', EditCourseDialogCtrl);
