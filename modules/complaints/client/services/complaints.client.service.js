//Complaints service used to communicate Complaints REST endpoints
(function () {
  'use strict';

  angular
    .module('complaints')
    .factory('ComplaintsService', ComplaintsService);

  ComplaintsService.$inject = ['$resource'];

  function ComplaintsService($resource) {
    return $resource('api/complaints/:complaintId', {
      complaintId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
