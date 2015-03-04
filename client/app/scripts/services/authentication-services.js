'use strict';

// Service provide authencication resource class


function AuthenticationInterceptor($q, $location){
  var responseInterceptor = {
    response: function() {
    },
    responseError: function(response){
      console.log('Authentication check: ' + response.status);
      $location.url('/login');
    }
  };

  return responseInterceptor;
}
AuthenticationInterceptor.$inject = ['$q', '$location'];

function Auth($resource, authenticationInterceptor){
  var options = {
    login: {method: 'POST', params: {verb: 'login'}},
    logout: {method: 'POST', params: {verb: 'logout'}},
    register: {method: 'POST', params: {verb: 'register'}, isArray: false},
    isExist: {method: 'POST', params: {verb: 'existence'}},
    check: {
      method: 'GET',
      params: {verb: 'loggedin'},
      interceptor: authenticationInterceptor
    }
  };
  return $resource('/users/:verb', {verb: 'login'}, options);
}
Auth.$inject = ['$resource','authenticationInterceptor'];

// Add to module
angular.module('authenticationServices', [])
  .factory('authenticationInterceptor', AuthenticationInterceptor)
  .factory('Auth', Auth);
