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