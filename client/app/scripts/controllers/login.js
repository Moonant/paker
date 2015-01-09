'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', 
  ['$scope', 
   '$http', 
   '$rootScope', 
   '$location',
   function ($scope, $http, $rootScope, $location) {
     $scope.hello = 'helloo';
     $scope.user = {};
     $scope.login = function(){
       $http.post('/login', {
         username: $scope.user.username,
         password: $scope.user.password,
       })
       .success(function(user){
         $rootScope.message = 'authentication successful';
         $location.url('/main');
       });
     };
     $scope.register = function(){
       $http.post('/register', {
       });
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
