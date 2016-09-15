(function () {
    "use strict";
    var services = angular.module('common.services').factory("appSettings", ['ngResource', 'ngRoute', '$http']);

    services.factory("Auth", function ($resource, appSettings) {
        return $resource(null, {}, {
            Login: { method: 'POST', url: appSettings.serverPath + "/api/Auth/Login"},
            RecuperarUsuario: { method: 'POST', url: appSettings.serverPath + "/api/Auth/RecoverNick"},
        });
    });

    services.factory("Users", function ($resource, appSettings) {
        return $resource(null, {}, {
            ObtenerUsuarios: { method: 'GET', url: appSettings.serverPath + "/api/Users/GetAllUsers"},
            CrearEditarUsuario: { method: 'POST', url: appSettings.serverPath + "/api/Users/CreateEditUser"},
        });
    });
    
    services.factory("GEO", function ($resource, appSettings) {
        return $resource(null, {}, {
            GetGEOLocation: { method: 'GET', url:"https://maps.googleapis.com/maps/api/geocode/json?latlng=:lat,:long&sensor=true"},
        });
    }); 
    
}());
