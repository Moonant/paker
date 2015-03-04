'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */

// Controller for the login.html, attached by routes
function LoginCtrl($scope, $rootScope, $location, $window, Auth) {
  $scope.hello = 'helloo';
  $scope.user = {};

  // login() called every 'login' clicked
  $scope.login = function(){
    var user = new Auth();
    user.username = $scope.user.username;
    user.password = $scope.user.password;
    user.$login(
      function(){
        $location.url('/main');
      }, 
      function(){
        $window.alert('账户或密码错误!');
      }
    );
  };
}
LoginCtrl.$inject = ['$scope', '$rootScope', '$location', '$window', 'Auth'];

// Controller for register-dialog.html
// attached by loginDirectives as registerDialog
function RegisterDialogCtrl($scope, $window, Auth){
  $scope.hello = 'helloo';
  this.username = '';
  this.password = '';
  this.message = '';
  var registerDialogCtrl = this;
  this.display = 'none';
  
  // register() called every 'register' clicked
  this.register = function() {
    var invalid = this.username === ''||
      this.password === '';
    if(invalid) {
      return;
    }
    var newUser = new Auth();
    newUser.username = this.username;
    newUser.password = this.password;
    newUser.$register(function(message) {
      if(message.username){
        $window.alert('注册成功, 请重新登录');
      }
      else {
        console.log('exited');
        registerDialogCtrl.message = '用户已存在';
      }
    });
  };
}
RegisterDialogCtrl.$inject = ['$scope', '$window', 'Auth'];

angular
  .module('loginControllers', ['authenticationServices'])
  .controller('LoginCtrl', LoginCtrl)
  .controller('RegisterDialogCtrl', RegisterDialogCtrl);
