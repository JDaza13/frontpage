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
        $scope.inputMsg = "A";

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
            if(gchatWindow == undefined){
                var gchatWindow = vm.createWindow.fromQuery('#globalChat', {
                    title: 'Sala General',
                    classname: 'globalChatWindow',
                    width: 2*(width/3),
                    height: 3*(height/4),
                    x: width/8,
                    y: height/6,
                    resizable: false,
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
            if(this.inputMsg != ""){
                socket.emit('broadcast', this.inputMsg);
                this.inputMsg = "";
            }
        }
        
        
        socket.on('serverSays', function(msg){
            $scope.messages.push(msg);
        });

    }
})();

