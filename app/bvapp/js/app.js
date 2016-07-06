var BV = angular.module('bvapp', ['angular-loading-bar', 'ngAnimate', 'ngRoute', 'ui.bootstrap', 'ngSanitize', 'hm.readmore']);

BV.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/apichecker', {
        templateUrl: 'views/apichecker.html',
        controller: 'bvapi'
    }).when('/apibuilder', {
        templateUrl: 'views/apibuilder.html',
        controller: 'bvapi'
    }).when('/', {
		templateUrl: 'views/api-index.html'
	}).otherwise({
    	redirectTo: "/"
	});
	
    /*
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    */
}])