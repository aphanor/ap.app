BV.factory('API', ['$scope', '$http', '$window', '$q', '$rootScope', '$routeParams', '$location', '$route', '$timeout', function($scope, $http, $window, $q, $rootScope, $routeParams, $location, $route, $timeout) {
    
    return {
        builder: function() {
            $scope.passkey;
            // Test results
            if ($scope.staging == true) {
                $scope.bv_api = $scope.stg_api + $scope.types + ".json?apiversion=5.4";
                $scope.api = $scope.stg_api + $scope.types + ".json?apiversion=5.4&passkey=";
                getData()
                $http.get($scope.stg_api + $scope.types + ".json?apiversion=5.4&passkey=" + $scope.passkey + "&limit=5").then(function(response) {
                    $scope.data_test = response.data;
                    console.log($scope.data_test);
                });
            } else {
                $scope.bv_api = $scope.prod_api + $scope.types + ".json?apiversion=5.4";
                $scope.api = $scope.prod_api + $scope.types + ".json?apiversion=5.4&passkey=";
                getData()
                $http.get($scope.prod_api + $scope.types + ".json?apiversion=5.4&passkey=" + $scope.passkey + "&limit=5").then(function(response) {
                    $scope.data_test = response.data;
                    console.log($scope.data_test);
                });
            }
            
            function getData() {
                if ($scope.passkey.length > 14) {
                    $http.get($scope.api + $scope.passkey).then(function(response) {
                        
                        console.log(response.data.HasErrors)
                        $scope.check = response.data.HasErrors;
                        $scope.apiURL = $scope.api + $scope.passkey;
                        
                        if($scope.check == false) {   
                            if ($scope.types == "reviews") {
                                $scope.data = response.data;
                                $scope.first_id = $scope.data.Results[0].ProductId;
                                console.log(response.data);
                            } else if ($scope.types == "questions") {
                                $scope.dataQA = response.data;
                                console.log($scope.dataQA);
                                $scope.first_id = $scope.dataQA.Results[0].ProductId;
                                $scope.q_first = $scope.dataQA.Results[0].Id;   
                            } else if ($scope.types == "authors") {
                                $scope.dataAuth = response.data;
                            } else if($scope.types == "products") {
                                $scope.dataProducts = response.data;
                            }
                        } else {
                            $scope.noapi = response.data.Errors["0"].Message;
                        }
                        
                    });
                } 
                else {
                    $scope.errormessage = "Invalid API KEY";
                }
            }
        },
        checker: function() {
            
            if ($scope.api_URL.indexOf("&include=products") != -1) {
                checkAPIURL ()
            } else {
                $scope.api_URL = $scope.api_URL + "&include=products";
                checkAPIURL ();
            }
            
            function checkAPIURL () {     
                $http.get($scope.api_URL).then(function(response) { 
                    
                    $scope.apidata = response.data;
                    
                    if(response.data.HasErrors == true) {
                        $scope.errormessage = response.data.Errors["0"].Message;
                        $scope.errorCheck = response.data.HasErrors;
                    } else 
                    {
                        if ($scope.api_URL.indexOf("reviews.json") != -1) {
                            $scope.apidata = response.data;
                            console.log($scope.apidata);
                            $scope.results = $scope.apidata.Results;
                            $scope.totalReviews = $scope.apidata.TotalResults;
                            $scope.Locale = $scope.apidata.Locale;
                            $scope.ratingsOnly = $scope.apidata.IsRatingsOnly;
                            $scope.apicalllimit = $scope.apidata.Limit;
                            
                            if ($scope.apidata.Includes.Products.length > 0 || $scope.apidata.Includes.ProductsOrder.length > 0) {
                                $scope.ProductsData = $scope.apidata.Includes.Products;
                                $scope.ProductsAttributes = $scope.apidata.Includes.ProductsOrder;
                            }
                            
                            $scope.SCount = 0;
                            $scope.IRO = 0;
                            $scope.objectData = [];
                            angular.forEach($scope.results, function(value, key) {    
                                $scope.resultsData = JSON.stringify(value.IsSyndicated);
                                $scope.ratingsOnlyReview = JSON.stringify(value.IsRatingsOnly);
                                
                                if ($scope.ratingsOnlyReview == "true") {
                                    $scope.IRO++
                                }
                                
                                if ($scope.resultsData == "true") {
                                    $scope.SCount++
                                    $scope.SReviews = {};
                                    $scope.SReviews ["id"] = value.Id;
                                    $scope.SReviews ["source"] = value.SyndicationSource.Name;
                            
                                    $scope.objectData.push($scope.SReviews);
                                }
                        
                            });
                            
                            var up = false;
                            
                            angular.forEach($scope.apidata.Includes.Products, function(value, key) {
                                
                                var reg = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gm;
                                    if(up != true) {
                                        var url = value.ProductPageUrl;
                                        up = true;
                                    }
                                var url = value.ProductPageUrl;
                                var regex = new RegExp(reg);
                                var resulti = regex.exec(url);
                                
                                if (resulti[1] != "null") {
                                    $scope.clientURL = resulti[0];
                                    $scope.client = resulti[1];   
                                }
                            });
                            
                            $scope.limit = $scope.apidata.Limit;
                            $scope.page = ($scope.apidata.TotalResults / $scope.limit);
                            
                            if($scope.page != Math.floor($scope.page)) {
                                $scope.page = Math.floor($scope.page) + 1;
                                for (i = 0; i < $scope.page; i++) { 
                                    if(i == 0) {
                                        var api_URL = $scope.api_URL;
                                        $scope.pager = {
                                            urls : [{url: api_URL}]
                                        };
                                    } else {
                                        $scope.Offset = i * $scope.limit;
                                        console.log("Offset: " + $scope.Offset);
                                        $scope.pager.urls.push({'url' : $scope.api_URL + "&offset=" + $scope.Offset});
                                    }
                                }
                            }
                            
                            console.log($scope.pager.urls);
                            $scope.paginations = $scope.pager.urls;
                            
                            $q.all($scope.objectData).then(function () {
                                $scope.SourcesSyndicated = $scope.objectData;
                            });
                            
                        } else if ($scope.api_URL.indexOf(".xml?") != -1) {
                            $scope.api_URL = $scope.api_URL.replace(".xml?", ".json?");
                            $timeout(checkAPIURL (), 500);
                        } else if ($scope.api_URL.indexOf("questions.json") != -1) {
                            console.log($scope.apidata);
                            $scope.errormessage = "Not supported yet"; 
                        } else if ($scope.api_URL.indexOf("statistics.json") != -1) {
                            console.log($scope.apidata);
                            $scope.errormessage = "Not supported yet";
                        } else if($scope.api_URL.indexOf("reviewcomments.json") != -1) {
                            console.log($scope.apidata);
                            $scope.errormessage = "Not supported yet";
                        } else if($scope.api_URL.indexOf("answers.json") != -1) {
                            console.log($scope.apidata);
                            $scope.errormessage = "Not supported yet";
                        } else if ($scope.api_URL.indexOf("authors.json") != -1) {
                            console.log($scope.apidata);
                            $scope.errormessage = "Not supported yet";
                        } else if ($scope.api_URL.indexOf("products.json") != -1) {
                            console.log($scope.apidata);
                            $scope.errormessage = "Not supported yet";
                        } else {
                            $scope.errormessage = "Invalid API call";
                        }
                    } 
        
                });
            }
        }
    }
    
    
    
    
    
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    
    auth.$onAuth(function(authUser) {
        if(authUser) {
            var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
            var userObj = $firebaseObject(userRef);
            $rootScope.currentUser = userObj;
        } else {
            $rootScope.currentUser = '';
        }
    })
    
    return {
        login: function(user) {
            auth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function(regUser){
                $location.path('/products');
            }).catch(function(error){
                $rootScope.message = error.message;
            })
        },
        logout: function() {
            return auth.$unauth();
        },
        register: function(user) {
            auth.$createuser({
                email: user.email,
                password: user.password
            }).then(function(regUser){
                
                var regRef = new Firebase(FIREBASE_URL + 'users')
                .child(regUser.uid).set({
                    date: Firebase.ServerValue.TIMESTAMP,
                    regUser: regUser.uid,
                    firstname: user.firstname,
                    lastname: user.email,
                    email: user.email
                })
                
                $location.href('/products');
            }).catch(function(error) {
                $rootScope.errormessage = error.message;
            })
        }
    }
}])