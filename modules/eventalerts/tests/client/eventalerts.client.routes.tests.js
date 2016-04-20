(function () {
  'use strict';

  describe('Eventalerts Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventalertsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventalertsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventalertsService = _EventalertsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('eventalerts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/eventalerts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EventalertsController,
          mockEventalert;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('eventalerts.view');
          $templateCache.put('modules/eventalerts/client/views/view-eventalert.client.view.html', '');

          // create mock Eventalert
          mockEventalert = new EventalertsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventalert Name'
          });

          //Initialize Controller
          EventalertsController = $controller('EventalertsController as vm', {
            $scope: $scope,
            eventalertResolve: mockEventalert
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventalertId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventalertResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventalertId: 1
          })).toEqual('/eventalerts/1');
        }));

        it('should attach an Eventalert to the controller scope', function () {
          expect($scope.vm.eventalert._id).toBe(mockEventalert._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/eventalerts/client/views/view-eventalert.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventalertsController,
          mockEventalert;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('eventalerts.create');
          $templateCache.put('modules/eventalerts/client/views/form-eventalert.client.view.html', '');

          // create mock Eventalert
          mockEventalert = new EventalertsService();

          //Initialize Controller
          EventalertsController = $controller('EventalertsController as vm', {
            $scope: $scope,
            eventalertResolve: mockEventalert
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventalertResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/eventalerts/create');
        }));

        it('should attach an Eventalert to the controller scope', function () {
          expect($scope.vm.eventalert._id).toBe(mockEventalert._id);
          expect($scope.vm.eventalert._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/eventalerts/client/views/form-eventalert.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventalertsController,
          mockEventalert;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('eventalerts.edit');
          $templateCache.put('modules/eventalerts/client/views/form-eventalert.client.view.html', '');

          // create mock Eventalert
          mockEventalert = new EventalertsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventalert Name'
          });

          //Initialize Controller
          EventalertsController = $controller('EventalertsController as vm', {
            $scope: $scope,
            eventalertResolve: mockEventalert
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventalertId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventalertResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventalertId: 1
          })).toEqual('/eventalerts/1/edit');
        }));

        it('should attach an Eventalert to the controller scope', function () {
          expect($scope.vm.eventalert._id).toBe(mockEventalert._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/eventalerts/client/views/form-eventalert.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
