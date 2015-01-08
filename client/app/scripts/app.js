'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'loginControllers',
    'mainControllers',
    'aboutControllers'
  ])
  .config(['$locationProvider', '$httpProvider', '$routeProvider',
  function ($locationProvider, $httpProvider, $routeProvider) {
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      var deferred = $q.defer();

      $http.get('/loggedin').success(function(user){
        if(user !== '0')
          $timeout(deferred.resolve, 0);
        else {
          $rootScope.message = 'You need to log in';
          $timeout(function(){
            deferred.reject();
          }, 0);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $httpProvider.interceptors.push(function($q, $location) {
      return function(promise) {
        return promise.then(
        function(response){
          return response;
        },
        function(response) {
          if(response.status === 401)
            $location.url('/login');
        });
      };
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          loggedin: checkLoggedin
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
  }])
  .run(function($rootScope, $http){
    $rootScope.message = '';
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out';
      $http.post('/logout');
    };
  });
