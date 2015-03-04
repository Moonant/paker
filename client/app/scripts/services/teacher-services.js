'use strict';

// Service provide apartment resource class
// exchange apartment issue data with service 

function Teacher($resource){
  var options = {
    get: { method: 'GET', isArray: false}
  };
  return $resource('/teachers/:tid',
    { tid: '' },
    options);
}
Teacher.$inject = ['$resource'];

// Add to module
angular.module('teacherServices', ['authenticationServices'])
  .factory('Teacher', Teacher);
