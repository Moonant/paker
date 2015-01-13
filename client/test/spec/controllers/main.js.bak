'use strict';

describe('mainControllers', function () {

  // load the controller's module
  beforeEach(module('mainControllers'));

  describe('MainCtrl', function(){
    var scope, ctrl;
    beforeEach(inject(function($rootScope, $controller){
      scope = $rootScope.$new();
      ctrl = $controller('MainCtrl', {$scope: scope});
    }));

    it('MainCtrl should work', function(){
      expect(scope.hello).toBe('hello');
    });
  });

});
