'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
function MainCtrl($scope, $location){
  $scope.hello = 'hello';
  $scope.current = $location.path();
}
MainCtrl.$inject = ['$scope','$location'];

angular.module('mainControllers', [])
  .controller('MainCtrl', MainCtrl);
