app.factory('generalConstructor', function() {
    return {
        modals: function(scope) {

            scope.openModal = function(modal_id){
                $('.modal').modal('hide');
                $("#"+modal_id).modal('show');
                
                if(modal_id=='modalRegister'){
                    scope.getGEOInfo();
                }
            }
            scope.closeModal = function(modal_id){
                $("#"+modal_id).modal('hide');
            }

        }
    };
});