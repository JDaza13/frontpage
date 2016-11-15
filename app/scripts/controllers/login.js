(function () {
    //'use strict';
    var controller = app.controller('loginController', loginController);

    loginController.$inject = ['Auth','Users','GEO','generalConstructor','$scope','$rootScope', '$location','$routeParams','AuthenticationService'];
    function loginController(Auth,Users,GEO,generalConstructor,$scope,$rootScope, $location,$routeParams,AuthenticationService) {
        
        $scope.Nickname = "";
        $scope.RegData = {
            _id: null,
            Address: "Calculando...",
            Photo: "images/empty_photo_150.png"
        };
        $scope.GEOInfo = {};
        $scope.EmailRecover = "";

        $scope.Login = function (e) {
            
            AuthenticationService.Login($scope.Nickname, function (response) {
                if (response.success)
                {
                    AuthenticationService.SetCredentials(response.success);
                    toastr.success("Autenticación satisfactoria!");
                    $("#modalLogin").modal('hide');
                    setTimeout(function(){ location.reload("#/home"); }, 500);
                    
                } else {
                    toastr.error(response.Msg);
                }
            });
        }


        $scope.Register = function (e) {
            var obj = {
                User: $scope.RegData
            };
            //Registrar el usuario
            Users.CrearEditarUsuario(obj)
               .$promise
                   .then(function (response) {
                        toastr.success("Registro satisfactorio");
                        setTimeout(function(){ location.reload(); }, 500);
                    })
                   .catch(function (response) {
                        console.log(response); 
                    });
        }
        $scope.Recover = function (e) {
            var obj = {
                User: {
                    Email: $scope.EmailRecover
                }
            };
            //Obtener el usuario
            Auth.RecuperarUsuario(obj)
               .$promise
                   .then(function (response) {
                       if(response.status == "success"){
                           toastr.success(response.Msg);
                           setTimeout(function(){ location.reload(); }, 500);
                       }
                       else{
                           toastr.error(response.Msg);
                       }
                    })
                   .catch(function (response) {
                        console.log(response); 
                    });
        }
        $scope.choosePhoto = function(){
            $("#photoRegSelect").trigger('click');
        }
        
        $scope.getGEOInfo = function(){
            navigator.geolocation.getCurrentPosition(function(position) {
              $scope.GEOInfo.coords = position.coords;
              var obj = $scope.GEOInfo.coords;
              
                GEO.GetGEOLocation({lat:obj.latitude,long:obj.longitude})
                   .$promise
                       .then(function (response) {
                            if(response.results.length>0){
                                $scope.RegData.Address = response.results[0].formatted_address;
                            }
                            else{
                                $scope.RegData.Address = "";
                                toastr.error("Error al obtener la dirección");
                            }
                        })
                       .catch(function (response) {
                            toastr.error("Error al obtener la dirección");
                        });
                        
              });
        }
        
        /*Example for modals with constructor here*/
        generalConstructor.modals($scope);
        /*End of constructor example*/
        $scope.openModal('modalLogin');
        
        $scope.photoRegSelected = function () {
            var file = document.getElementById("photoRegSelect").files[0];

            var img = document.createElement("img");
            var reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;

                var canvas = document.createElement("canvas");

                var MAX_WIDTH = 150;
                var MAX_HEIGHT = 150;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                var dataurl = canvas.toDataURL("image/png");

                $scope.RegData.Photo = dataurl;
                $scope.$apply();
            }
            reader.readAsDataURL(file);
        };

        
    }
})();

