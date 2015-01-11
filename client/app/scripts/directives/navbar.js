'use strict';

// Directives for navbar

var navbarDirectives = angular.module('navbarDirectives', ['loginControllers']);
navbarDirectives.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/navbar-div.html'
  };
});
navbarDirectives.directive('conditionalRightNavbar', function() {
  return {
    restrict: 'A'
    //link: link
  };
});
