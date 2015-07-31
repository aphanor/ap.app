var AP = angular.module('AP', ['ngAnimate', 'angular-steps', 'ui.bootstrap','rzModule']);
                
AP.filter('nfcurrency', ['$filter', '$locale', function ($filter, $locale) {
    var currency = $filter('currency'),
        formats = $locale.NUMBER_FORMATS;

    return function (amount, symbol) {
        var value = currency(amount, symbol);
        return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
    };
}]);

AP.controller('stepsCtrl', ['$scope', 'StepsService', function ($scope, StepsService) {
    $scope.gogo = function (to) {
        StepsService.steps().goTo(to);
    };
    
    $scope.finished = function () {
        console.log('Done!');
    };
}]);

AP.controller('mainCtrl', function($scope, $timeout) {
    $scope.broadcast = function() {
        $timeout(function() {
            $scope.$broadcast('reCalcViewDimensions');
        });
    }
})

AP.controller('sliderCtrl', ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
    
    $scope.priceSlider = {
        min: 2500,
        max: 6500,
        ceil: 10000,
        floor: 500
    };
    
    $scope.timeScale = {
        min: 6,
        max: 9,
        ceil: 15,
        floor: 2
    };
}])

AP.controller('EmailCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.submitEmail = function() {
        //Request
        $http.post('/email', $scope.email) 
        .success(function(data, status) {
            console.log("Sent ok");
        })
        .error(function(data, status) {
            console.log("Error");
        })
    };
}]);
