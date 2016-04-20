(function () {
    'use strict';

    angular
        .module('eventalerts')
        .controller('EventalertsListController', EventalertsListController);

    EventalertsListController.$inject = ['EventalertsService'];

    function EventalertsListController(EventalertsService) {
        var vm = this;

        vm.eventalerts = EventalertsService.query();
        console.log(vm.eventalerts);
    }
})();
