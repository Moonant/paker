'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('loginControllers', [])
  .controller('LoginCtrl', 
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
  }]);
