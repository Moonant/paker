'use strict';

// Directives for navbar

function ConditionalRightNavbar($location) {
  return {
    restrict: 'A',
    templateUrl: function(){
      var current = $location.path();
      var patt = new RegExp('login');
      if(patt.test(current)){
        return 'views/navbar-right-login.html';
      }
      return 'views/navbar-right-main.html';
    }
  };
}
ConditionalRightNavbar.$inject = ['$location'];
angular.module('navbarDirectives', ['loginControllers'])
  .directive('conditionalRightNavbar', ConditionalRightNavbar)
  .directive('navbar', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/navbar-div.html'
    };
  });
