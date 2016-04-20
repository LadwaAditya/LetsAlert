(function () {
  'use strict';

  // Eventalerts controller
  angular
    .module('eventalerts')
    .controller('EventalertsController', EventalertsController);

  EventalertsController.$inject = ['$scope', '$state', 'Authentication', 'eventalertResolve'];

  function EventalertsController ($scope, $state, Authentication, eventalert) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventalert = eventalert;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Eventalert
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.eventalert.$remove($state.go('eventalerts.list'));
      }
    }

    // Save Eventalert
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventalertForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.eventalert._id) {
        vm.eventalert.$update(successCallback, errorCallback);
      } else {
        vm.eventalert.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventalerts.view', {
          eventalertId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
