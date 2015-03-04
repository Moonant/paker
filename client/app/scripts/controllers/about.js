'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('aboutControllers', [])
  .controller('AboutCtrl', ['$scope', function ($scope) {
		$scope.hello = 'hello';
  }]);
