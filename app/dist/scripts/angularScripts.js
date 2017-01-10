var app = null;

(function () {
  'use strict';
  app = angular
  .module('ajsApp', [
    'common.services',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

}());

/* Separator */

(function () {
    //"use strict";

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeController',
            controllerAs: 'vm',
            caseInsensitiveMatch: true
        });
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginController',
            controllerAs: 'vm',
            caseInsensitiveMatch: true
        });
        $routeProvider.when('/register', {
            templateUrl: 'views/register.html',
            controller: 'registerController',
            controllerAs: 'vm',
            caseInsensitiveMatch: true
        });        

        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }]);

    app.run(['$rootScope', '$location', '$cookieStore', '$templateCache',
    function ($rootScope, $location, $cookieStore, $templateCache) {

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {

            //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
           
            if ($rootScope.globals.currentUser && $location.path() == '/login') {
                $location.path('/home');
            }
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
            
        });
    }]);
}());

/* Separator */

(function () {
    "use strict";
    angular.module('ajsApp').factory('AuthenticationService',
    ['Auth','Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Auth,Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        $rootScope.displayLogout = false;
        service.Login = function (username, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
                //Iniciar Sesión
                var obj = {
                    nick: username
                };
                
                Auth.Login(obj)
                   .$promise
                       .then(function (response) {
                            callback(response);
                        })
                       .catch(function (response) {
                            callback(response);
                        });
                /*
            
                var response = { success: username === 'test'};
                if (!response.success) {
                    alert("autenticacion incorrecta");
                    response.message = 'Username does not exist!';
                }
                callback(response);
                */


            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });

        };

        service.SetCredentials = function (obj) {
            var authdata = Base64.encode(obj.Nick);
            
            $rootScope.globals = {
                currentUser: {
                    nick: obj.Nick,
                    authdata: authdata
                }
            };

            localStorage.setItem("usrData", JSON.stringify(obj));
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            //Colocar expiracion cookies
            //var now = new Date();
            //now.setDate(now.getDate() + 7);

            //$cookies.put("tech", "angularjs", {
            //    expires: now
            //});
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {
            localStorage.removeItem("usrData");
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;
    }])

.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});

}());

/* Separator */

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



/* Separator */

(function () {
    //'use strict';
    var controller = app.controller('registerController', registerController);

    registerController.$inject = ['$scope','$rootScope', '$location','$routeParams'];
    function registerController($scope,$rootScope, $location,$routeParams) {
        alert("Hola mundo!");
    }
})();



/* Separator */

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



/* Separator */

(function () {
    //'use strict';
    var controller = app.controller('homeController', homeController);

    homeController.$inject = ['Users','generalConstructor','$scope','$rootScope', '$location','$window','$routeParams'];
    function homeController(Users,generalConstructor,$scope,$rootScope, $location,$window,$routeParams) {

        var vm = new Ventus.WindowManager();
        $scope.gchatWindow = undefined;
        var width = $( window ).width();
        var height = $( window ).height();
        var socket = io.connect();
        
        /*Example for modals with constructor here*/
        generalConstructor.modals($scope);
        /*End of constructor example*/
        
        var favicon=new Favico({
            animation:'slide'
        });
        
        $scope.usrData = JSON.parse(localStorage.getItem("usrData"));
        $scope.messages = [];
        $scope.blurMsgs = [];
        $scope.inputMsg = "";
        
        $scope.contacts = [];
        
        //Obtener los Usuarios
        Users.ObtenerUsuarios()
           .$promise
               .then(function (response) {
                    $scope.contacts = response.Users;
                })
               .catch(function (response) {
                    console.log(response); 
                });
        
        $scope.openGChatWindow = function(){
                $scope.gchatWindow.open();
        }
        
        $scope.defineChatWindow = function () {
            $('#globalChat').removeClass('displayNone');
            $scope.gchatWindow = vm.createWindow.fromQuery('#globalChat', {
                title: 'Sala General',
                classname: 'globalChatWindow',
                width: 2*(width/3),
                height: 5*(height/6),
                x: width/6,
                y: height/8,
                resizable: false,
                events: {
                    open: function() {
                        setTimeout(function(){ 
                            $(".chatMsgs").animate({ scrollTop: $('.chatMsgs').prop("scrollHeight")}, 500);
                            $(".chatInput").focus();
                        }, 500);
                    }
                }
            });
            
            $('#globalChat').css("width",2*(width/3));
            $('#globalChat').css("height",5*(height/6));
        }
        

        
        $scope.SendMsg = function () {
            var nick = $scope.usrData.Nombre;
            var now = moment().format('DD/MM/YYYY HH:mm');
            var msg = this.inputMsg;
            
            var obj = {
                Sender: nick,
                Msg: msg,
                Date: now
            };
            
            if(this.inputMsg != ""){
                socket.emit('broadcast', obj);
                this.inputMsg = "";
            }
        }
        
        
        socket.on('serverSays', function(msg){
            $scope.messages.push(msg);
            $scope.$apply();
            $('.chatMsgs').scrollTop($('.chatMsgs')[0].scrollHeight);
            
            var msgSize = $scope.messages.length;
            favicon.badge(msgSize);
        });
        
        $window.onfocus = function(){
            console.log("focused");
        }
        $window.onblur = function(){
            console.log("blured");
        }

    }
})();



/* Separator */

(function () {
    //'use strict';
    var controller = app.controller('userInfoController', userInfoController);

    userInfoController.$inject = ['Users','$scope','$rootScope', '$location','$routeParams','AuthenticationService'];
    function userInfoController(Users,$scope,$rootScope, $location,$routeParams,AuthenticationService) {

        $scope.usrData = JSON.parse(localStorage.getItem("usrData"));
        $("#modalUserInfo").modal('show');

    }
})();

