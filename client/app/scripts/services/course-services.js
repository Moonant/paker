'use strict';

// Service provide apartment resource class
// exchange apartment issue data with service 

function Course($resource){
  var options = {
    update: { method: 'PUT' }
  };
  return $resource('/courses/:crsid',
    { crsid: '' },
    options);
}
Course.$inject = ['$resource'];

// Add to module
angular.module('courseServices', ['authenticationServices'])
  .factory('Course', Course);
