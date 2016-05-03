(function () {
  'use strict';

  describe('Complaints Route Tests', function () {
    // Initialize global variables
    var $scope,
      ComplaintsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ComplaintsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ComplaintsService = _ComplaintsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('complaints');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/complaints');
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
          ComplaintsController,
          mockComplaint;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('complaints.view');
          $templateCache.put('modules/complaints/client/views/view-complaint.client.view.html', '');

          // create mock Complaint
          mockComplaint = new ComplaintsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Complaint Name'
          });

          //Initialize Controller
          ComplaintsController = $controller('ComplaintsController as vm', {
            $scope: $scope,
            complaintResolve: mockComplaint
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:complaintId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.complaintResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            complaintId: 1
          })).toEqual('/complaints/1');
        }));

        it('should attach an Complaint to the controller scope', function () {
          expect($scope.vm.complaint._id).toBe(mockComplaint._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/complaints/client/views/view-complaint.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ComplaintsController,
          mockComplaint;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('complaints.create');
          $templateCache.put('modules/complaints/client/views/form-complaint.client.view.html', '');

          // create mock Complaint
          mockComplaint = new ComplaintsService();

          //Initialize Controller
          ComplaintsController = $controller('ComplaintsController as vm', {
            $scope: $scope,
            complaintResolve: mockComplaint
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.complaintResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/complaints/create');
        }));

        it('should attach an Complaint to the controller scope', function () {
          expect($scope.vm.complaint._id).toBe(mockComplaint._id);
          expect($scope.vm.complaint._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/complaints/client/views/form-complaint.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ComplaintsController,
          mockComplaint;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('complaints.edit');
          $templateCache.put('modules/complaints/client/views/form-complaint.client.view.html', '');

          // create mock Complaint
          mockComplaint = new ComplaintsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Complaint Name'
          });

          //Initialize Controller
          ComplaintsController = $controller('ComplaintsController as vm', {
            $scope: $scope,
            complaintResolve: mockComplaint
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:complaintId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.complaintResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            complaintId: 1
          })).toEqual('/complaints/1/edit');
        }));

        it('should attach an Complaint to the controller scope', function () {
          expect($scope.vm.complaint._id).toBe(mockComplaint._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/complaints/client/views/form-complaint.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
