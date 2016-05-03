(function () {
  'use strict';

  angular
    .module('complaints')
    .controller('ComplaintsListController', ComplaintsListController);

  ComplaintsListController.$inject = ['ComplaintsService'];

  function ComplaintsListController(ComplaintsService) {
    var vm = this;

    vm.complaints = ComplaintsService.query();
  }
})();
