(function () {
    "use strict";
    angular
        .module("common.services", ["ngResource"])
        .constant("appSettings",
        {
            serverPath: "https://frontpage-jdaza13.c9users.io"
        });

}());