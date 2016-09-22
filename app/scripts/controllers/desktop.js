(function () {
    //'use strict';
    var controller = app.controller('desktopController', desktopController);

    desktopController.$inject = ['Users','$scope','$rootScope', '$location','$routeParams','AuthenticationService'];
    function desktopController(Users,$scope,$rootScope, $location,$routeParams,AuthenticationService) {
        $scope.pathToBackground = "/images/ubuntu1.jpg";
        $scope.usrLogged = false;

        var credentials = $rootScope.globals.currentUser;
        var usrData = JSON.parse(localStorage.getItem("usrData"));

        //console.log(usrData);
        
        if(credentials){
            $scope.loggedUserInfo = "Hola, "+credentials.nick;
            $scope.usrLogged = true;
        }
        else{
            $scope.loggedUserInfo = "Iniciar sesión";
            $scope.usrLogged = false;
            $("#userInfo").addClass('likeAnchor');
            $( "#userInfo" ).click(function() {
                $("#modalLogin").modal('show');
            });
        }

        $scope.goFullScreen = function(){
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        }

        $scope.Logout = function()
        {
            AuthenticationService.ClearCredentials();
            location.reload("#/login");
        }

    }
})();

