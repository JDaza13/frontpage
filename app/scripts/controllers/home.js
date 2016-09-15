(function () {
    //'use strict';
    var controller = app.controller('homeController', homeController);

    homeController.$inject = ['$scope','$rootScope', '$location','$routeParams'];
    function homeController($scope,$rootScope, $location,$routeParams) {

        $scope.usrData = JSON.parse(localStorage.getItem("usrData"));

        $scope.openUserInfoModal = function(){
            $("#modalUserInfo").modal('show');
        }
        
        $scope.closeModalUserInfo = function(){
            $("#modalUserInfo").modal('hide');
        }


    }
})();

