'use strict';

// Directives for login 

angular.module('loginDirectives', ['loginControllers'])
  .directive('registerDialog', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/register-dialog.html'
    };
  });

