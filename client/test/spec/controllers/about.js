'use strict';

describe('module aboutControllers', function () {
  // load the controller's module
  beforeEach(module('aboutControllers'));

  describe('AboutCtrl controller', function() {
    var scope, ctrl;
    beforeEach(inject(function($rootScope, $controller){
      scope = $rootScope.$new();
      ctrl = $controller('AboutCtrl', {$scope: scope});
    }));

    it('AboutCtrl should be work', function(){
      expect(scope.hello).toBe('hello');
    });
  });

});
