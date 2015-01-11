'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
var loginControllers = angular.module('loginControllers', ['authenticationServices']);

loginControllers.controller('LoginCtrl', 
  ['$scope', 
   '$http', 
   '$rootScope', 
   '$location',
   'Auth',
   function ($scope, $http, $rootScope, $location, Auth) {
     $scope.hello = 'helloo';
     $scope.user = {};
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
  ]);

loginControllers.controller('RegisterDialogCtrl',
  ['$scope',
   function($scope){
      this.registerForm = {};
      this.registerForm.username = '';
      this.registerForm.password = '';
      this.register = function() {
        var invalid = this.registerForm.username === ''||
          this.registerForm.password === '';
        if(invalid)
          return;
        console.log('fun ');
      };
   }
  ]);
