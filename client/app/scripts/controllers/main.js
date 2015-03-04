'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
function MainCtrl($scope, $location, Auth){
  $scope.hello = 'hello';
  $scope.logout = function(){
    Auth.logout();
    $location.url('/login');
  };
}
MainCtrl.$inject = ['$scope', '$location', 'Auth'];

angular.module('mainControllers', ['authenticationServices'])
  .controller('MainCtrl', MainCtrl);
