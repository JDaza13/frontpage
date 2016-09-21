(function () {
    //'use strict';
    var controller = app.controller('homeController', homeController);

    homeController.$inject = ['$scope','$rootScope', '$location','$routeParams'];
    function homeController($scope,$rootScope, $location,$routeParams) {

        var vm = new Ventus.WindowManager();
        var width = $( window ).width();
        var height = $( window ).height();
        var socket = io.connect();
        
        $scope.usrData = JSON.parse(localStorage.getItem("usrData"));
        $scope.messages = [];
        $scope.inputMsg = "";

        $scope.openUserInfoModal = function(){
            $("#modalUserInfo").modal('show');
        }
        
        $scope.closeModalUserInfo = function(){
            $("#modalUserInfo").modal('hide');
        }
        
        $scope.openAboutModal = function(){
            $("#modalAbout").modal('show');
        }

        $scope.closeModalAbout = function(){
            $("#modalAbout").modal('hide');
        }
        
        $scope.openGChatWindow = function(){
            $('#globalChat').removeClass('displayNone');
            if(gchatWindow == undefined){
                var gchatWindow = vm.createWindow.fromQuery('#globalChat', {
                    title: 'Sala General',
                    classname: 'globalChatWindow',
                    width: 2*(width/3),
                    height: 3*(height/4),
                    x: width/8,
                    y: height/6,
                    resizable: false,
                    events: {
                        open: function() {
                            setTimeout(function(){ 
                                $(".chatMsgs").animate({ scrollTop: $('.chatMsgs').prop("scrollHeight")}, 500);
                            }, 500);
                        }
                    }
                });
                $('#globalChat').css("width",2*(width/3));
                $('#globalChat').css("height",3*(height/4));
                gchatWindow.open();
                //$( "#globalChat" ).parent();
            }
            else{
                gchatWindow.destroy();
                gchatWindow.open();
            }
            
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
        });

    }
})();

