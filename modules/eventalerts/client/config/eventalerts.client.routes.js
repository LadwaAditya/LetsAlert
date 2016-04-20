(function () {
  'use strict';

  angular
    .module('eventalerts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventalerts', {
        abstract: true,
        url: '/eventalerts',
        template: '<ui-view/>'
      })
      .state('eventalerts.list', {
        url: '',
        templateUrl: 'modules/eventalerts/client/views/list-eventalerts.client.view.html',
        controller: 'EventalertsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Eventalerts List'
        }
      })
      .state('eventalerts.create', {
        url: '/create',
        templateUrl: 'modules/eventalerts/client/views/form-eventalert.client.view.html',
        controller: 'EventalertsController',
        controllerAs: 'vm',
        resolve: {
          eventalertResolve: newEventalert
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Eventalerts Create'
        }
      })
      .state('eventalerts.edit', {
        url: '/:eventalertId/edit',
        templateUrl: 'modules/eventalerts/client/views/form-eventalert.client.view.html',
        controller: 'EventalertsController',
        controllerAs: 'vm',
        resolve: {
          eventalertResolve: getEventalert
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Eventalert {{ eventalertResolve.name }}'
        }
      })
      .state('eventalerts.view', {
        url: '/:eventalertId',
        templateUrl: 'modules/eventalerts/client/views/view-eventalert.client.view.html',
        controller: 'EventalertsController',
        controllerAs: 'vm',
        resolve: {
          eventalertResolve: getEventalert
        },
        data:{
          pageTitle: 'Eventalert {{ articleResolve.name }}'
        }
      });
  }

  getEventalert.$inject = ['$stateParams', 'EventalertsService'];

  function getEventalert($stateParams, EventalertsService) {
    return EventalertsService.get({
      eventalertId: $stateParams.eventalertId
    }).$promise;
  }

  newEventalert.$inject = ['EventalertsService'];

  function newEventalert(EventalertsService) {
    return new EventalertsService();
  }
})();
