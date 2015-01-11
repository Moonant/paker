'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */

function LoginCtrl($scope, $rootScope, $location, Auth) {
  $scope.hello = 'helloo';
  $scope.user = {};
  //$scope.current = $location.path();
  $scope.login = function(){
    var user = new Auth();
    user.username = $scope.user.username;
    user.password = $scope.user.password;
    user.$login();
    $location.url('/main');
  };
  $scope.register = function(){
  };
}
LoginCtrl.$inject = ['$scope', '$rootScope', '$location', 'Auth'];

function RegisterDialogCtrl($scope){
  $scope.hello = 'helloo';
  this.registerForm = {};
  this.registerForm.username = '';
  this.registerForm.password = '';
  this.register = function() {
    var invalid = this.registerForm.username === ''||
      this.registerForm.password === '';
    if(invalid) {
      return;
    }
    console.log('fun ');
  };
}
RegisterDialogCtrl.$inject = ['$scope'];

function Jeff(){
  return {
    //templateUrl: 'views/navbar-right-login.html'
    templateUrl: function(elem, attr){
      console.log(attr.type);
      return 'views/navbar-right-login.html';
    }
  };
}

angular
  .module('loginControllers', ['authenticationServices'])
  .controller('LoginCtrl', LoginCtrl)
  .controller('RegisterDialogCtrl', RegisterDialogCtrl)
  .directive('jeff', Jeff);
