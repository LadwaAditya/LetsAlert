(function () {
  'use strict';

  angular
    .module('complaints')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('complaints', {
        abstract: true,
        url: '/complaints',
        template: '<ui-view/>'
      })
      .state('complaints.list', {
        url: '',
        templateUrl: 'modules/complaints/client/views/list-complaints.client.view.html',
        controller: 'ComplaintsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Complaints List'
        }
      })
      .state('complaints.create', {
        url: '/create',
        templateUrl: 'modules/complaints/client/views/form-complaint.client.view.html',
        controller: 'ComplaintsController',
        controllerAs: 'vm',
        resolve: {
          complaintResolve: newComplaint
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Complaints Create'
        }
      })
      .state('complaints.edit', {
        url: '/:complaintId/edit',
        templateUrl: 'modules/complaints/client/views/form-complaint.client.view.html',
        controller: 'ComplaintsController',
        controllerAs: 'vm',
        resolve: {
          complaintResolve: getComplaint
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Complaint {{ complaintResolve.name }}'
        }
      })
      .state('complaints.view', {
        url: '/:complaintId',
        templateUrl: 'modules/complaints/client/views/view-complaint.client.view.html',
        controller: 'ComplaintsController',
        controllerAs: 'vm',
        resolve: {
          complaintResolve: getComplaint
        },
        data:{
          pageTitle: 'Complaint {{ articleResolve.name }}'
        }
      });
  }

  getComplaint.$inject = ['$stateParams', 'ComplaintsService'];

  function getComplaint($stateParams, ComplaintsService) {
    return ComplaintsService.get({
      complaintId: $stateParams.complaintId
    }).$promise;
  }

  newComplaint.$inject = ['ComplaintsService'];

  function newComplaint(ComplaintsService) {
    return new ComplaintsService();
  }
})();
