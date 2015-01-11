'use strict';

// Service provide authencication resource class

var authencicationServices = angular.module('authenticationServices', []);

authencicationServices.factory('authenticationInterceptor',
  ['$q',
   '$location',
   function($q, $location){
     var responseInterceptor = {
       response: function(response) {
       },
       responseError: function(response){
         console.log('Unauthorized');
         if(response.status === 401)
           $location.url('/login');
      }
     };

     return responseInterceptor;
   }
  ]);

authencicationServices.factory('Auth', 
  ['$resource'
  ,'authenticationInterceptor'
  ,function($resource, authenticationInterceptor){
    return $resource('/user/:verb', {verb: 'login'}, {
     login: {method: 'POST', params: {verb: 'login'}, isArray: false},
     logout: {method: 'POST', params: {verb: 'logout'}},
     check: {method: 'GET', params: {verb: ''}, interceptor: authenticationInterceptor, isArray: true}
    });
  }]);
