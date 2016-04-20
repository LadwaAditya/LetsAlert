//Eventalerts service used to communicate Eventalerts REST endpoints
(function () {
  'use strict';

  angular
    .module('eventalerts')
    .factory('EventalertsService', EventalertsService);

  EventalertsService.$inject = ['$resource'];

  function EventalertsService($resource) {
    return $resource('api/eventalerts/:eventalertId', {
      eventalertId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
