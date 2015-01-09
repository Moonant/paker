'use strict';

// Directives for login 

var loginDirectives = angular.module('loginDirectives', ['loginControllers']);
loginDirectives.directive("registerDialog",
  [
   function() {
     return {
       restrict: 'E',
       templateUrl: "views/register-dialog.html",
       controller: 'RegisterDialogCtrl',
       controllerAs: 'registerDialog'
     };
   }
  ]);
