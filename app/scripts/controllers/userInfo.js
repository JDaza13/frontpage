(function () {
    //'use strict';
    var controller = app.controller('userInfoController', userInfoController);

    userInfoController.$inject = ['Users','$scope','$rootScope', '$location','$routeParams','AuthenticationService'];
    function userInfoController(Users,$scope,$rootScope, $location,$routeParams,AuthenticationService) {

        $scope.usrData = JSON.parse(localStorage.getItem("usrData"));
        $("#modalUserInfo").modal('show');

    }
})();

