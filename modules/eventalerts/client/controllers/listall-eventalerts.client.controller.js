(function () {
    'use strict';

    angular
        .module('eventalerts')
        .controller('EventalertsListAllController', ['$http', '$scope', 'Authentication', EventalertsListAllController]);


    function EventalertsListAllController($http, $scope, Authentication) {
        var vm = this;
        vm.authentication = Authentication;
        $http.get('/api/eventalertsall', vm.authentication.user).success(function (response) {
            $scope.allevents = response;
            console.log($scope.allevents);
        });
    }
})();
