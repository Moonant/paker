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
    .when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        loggedin: function(Auth){
          return Auth.check();
        }
      }
    })
    .when('/', {
      resolve: {
        loggedin: function(Auth, $location){
          Auth.check(function() {
            $location.url('/main');
          });
          return;
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
    'authenticationServices',
    'ui.bootstrap'
  ])
  .config(ModuleConfig)
  .run(ModuleRun);
