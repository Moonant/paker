'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */

// Controller for the login.html, attached by routes
function LoginCtrl($scope, $rootScope, $modal, $location, $window, Auth) {
  var loginCtrl = $scope;
  $scope.user = {};

  // alert for wrong username or password
  $scope.wrongPasswordDialog = function(size) {
    $modal.open({
      templateUrl: 'messageDialog.html',
      controller: 'MessageDialogCtrl',
      resolve: {
        title: function() {
          return '用户名或密码错误';
        },
        msg: function() {
          return '请重新登录';
        }
      },
      size: size
    });
  };

  // login() called every 'login' clicked
  $scope.login = function() {
    var user = new Auth();
    user.username = $scope.user.username;
    user.password = $scope.user.password;
    user.$login(
      function(){
        $location.url('/main');
      }, 
      function(){
        loginCtrl.user.username = '';
        loginCtrl.user.password = '';
        loginCtrl.wrongPasswordDialog('lg');
      }
    );
  };

  // registerDialogAlert() called every 'register' clicked
  $scope.registerDialogAlert = function() {
    $modal.open({
      templateUrl: 'registerDialog.html',
      controller: 'RegisterDialogCtrl',
      size: 'lg'
    });
  };
}
LoginCtrl.$inject = ['$scope', '$rootScope', '$modal',
  '$location', '$window', 'Auth'];


// Controller for register-dialog.html
// attached by $modal in LoginCtrl
function RegisterDialogCtrl($scope, $window, $modalInstance, Auth, $modal){
  $scope.username = '';
  $scope.password = '';
  $scope.alerts = [];

  // input alert to tell the status
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  // cancel the regiser dialog
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  // dialog when register successed
  $scope.successDialog = function(size) {
    $modal.open({
      templateUrl: 'messageDialog.html',
      controller: 'MessageDialogCtrl',
      resolve: {
        title: function() {
          return '注册成功!';
        },
        msg: function() {
          return '请重新登录';
        }
      },
      size: size
    });
  };

  // checkExistence() called every lose focus of name field
  $scope.checkExistence = function() {
    console.log($scope.register);
    var invalid = $scope.username === '';
    if(invalid) {
      $scope.alerts.push({msg: '用户字段不能为空'});
    }
    else {
      var newUser = new Auth();
      newUser.username = $scope.username;
      newUser.$isExist(function(){
        if(newUser.existence) {
          $scope.alerts.push({msg: '用户已存在'});
        }
      });
    }
  };
  
  // register() called every 'register' clicked
  $scope.register = function() {
    var invalid = $scope.username === ''|| $scope.password === '';

    // input invalid
    if(invalid) {
      $scope.alerts.push({msg: '不能留空'});
      return;
    }
    var newUser = new Auth();
    newUser.username = $scope.username;
    newUser.password = $scope.password;
    newUser.$register(function(message) {
      if(message.username){
        $modalInstance.close();
        $scope.successDialog();
      }
      else {
        $scope.alerts.push({msg: '失败'});
      }
    });
  };
}
RegisterDialogCtrl.$inject = ['$scope', '$window',
  '$modalInstance', 'Auth', '$modal'];


// Controller for alerted MessageDialog
function MessageDialogCtrl($scope, $modalInstance, title, msg) {
  $scope.title = title;
  $scope.msg = msg;
  $scope.ok = function() {
    $modalInstance.close();
  };
}
MessageDialogCtrl.$inject = ['$scope', '$modalInstance', 'title', 'msg'];


angular
  .module('loginControllers', ['authenticationServices'])
  .controller('LoginCtrl', LoginCtrl)
  .controller('RegisterDialogCtrl', RegisterDialogCtrl)
  .controller('MessageDialogCtrl', MessageDialogCtrl);
