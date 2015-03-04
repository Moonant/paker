'use strict';

// Service provide apartment resource class
// exchange apartment issue data with service 

function Apartment($resource){
  var options = {
    get: { method: 'GET', isArray: false}
  };
  return $resource('/apartments/:aptid', 
    {aptid: ''}, options);
}
Apartment.$inject = ['$resource'];

function Major($resource) {
  var options = {
  };
  return $resource(
    '/apartments/:aptid/majors/:mjid',
    { aptid: '', mjid: ''},
    options
  );
}
Major.$inject = ['$resource'];

function Cls($resource) {
  var options = {
  };
  return $resource(
    '/apartments/:aptid/majors/:mjid/classes/:clsid',
    { aptid: '', mjid: '', clsid: ''},
    options
  );
}
Cls.$inject = ['$resource'];

// Add to module
angular.module('apartmentServices', ['authenticationServices'])
  .factory('Major', Major)
  .factory('Cls', Cls)
  .factory('Apartment', Apartment);
