var AP = angular.module('AP', []);

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