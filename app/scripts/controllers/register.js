(function () {
    //'use strict';
    var controller = app.controller('registerController', registerController);

    registerController.$inject = ['$scope','$rootScope', '$location','$routeParams'];
    function registerController($scope,$rootScope, $location,$routeParams) {
        alert("Hola mundo!");
    }
})();

