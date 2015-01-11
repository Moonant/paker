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
  function link(scope, element, attrs){
    console.dir(attrs);
  }
  return {
    restrict: 'A',
    link: link
  };
});
