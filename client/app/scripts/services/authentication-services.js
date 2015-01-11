'use strict';

// Service provide authencication resource class

var authencicationServices = angular.module('authenticationServices', []);

function AuthenticationInterceptor($q, $location){
  var responseInterceptor = {
    response: function() {
    },
    responseError: function(response){
      //console.log('Authentication check: ' + response.status);
      $location.url('/login');
    }
  };

  return responseInterceptor;
}
authencicationServices.factory('authenticationInterceptor', 
  AuthenticationInterceptor);
AuthenticationInterceptor.$inject = ['$q', '$location'];

function Auth($resource, authenticationInterceptor){
  var options = {
    login: {method: 'POST', params: {verb: 'login'}, isArray: false},
    logout: {method: 'POST', params: {verb: 'logout'}},
    check: {
      method: 'GET', params: {verb: ''},
      interceptor: authenticationInterceptor, isArray: true
    }
  };
  return $resource('/user/:verb', {verb: 'login'}, options);
}
authencicationServices.factory('Auth', Auth);
Auth.$inject = ['$resource','authenticationInterceptor'];
