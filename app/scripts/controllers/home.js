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

