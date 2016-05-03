(function () {
  'use strict';

  // Complaints controller
  angular
    .module('complaints')
    .controller('ComplaintsController', ComplaintsController);

  ComplaintsController.$inject = ['$scope', '$state', 'Authentication', 'complaintResolve'];

  function ComplaintsController ($scope, $state, Authentication, complaint) {
    var vm = this;

    vm.authentication = Authentication;
    vm.complaint = complaint;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Complaint
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.complaint.$remove($state.go('complaints.list'));
      }
    }

    // Save Complaint
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.complaintForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.complaint._id) {
        vm.complaint.$update(successCallback, errorCallback);
      } else {
        vm.complaint.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('complaints.view', {
          complaintId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
