'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */

function ModuleConfig($locationProvider, $httpProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        loggedin: function(Auth){
          return Auth.check();
        }
      }
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}
ModuleConfig.$inject = ['$locationProvider' ,'$httpProvider' ,'$routeProvider'];

function ModuleRun($rootScope){
  $rootScope.message = '';
}
ModuleRun.$inject = ['$rootScope'];

angular
  .module('clientApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'loginControllers',
    'mainControllers',
    'aboutControllers',
    'loginDirectives',
    'navbarDirectives',
    'authenticationServices'
  ])
  .config(ModuleConfig)
  .run(ModuleRun);
