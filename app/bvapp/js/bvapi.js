/*
    ******************************* BV API - Main View Controller *******************************
*/

BV.controller('bvapi', ['$scope', 'APIapp', function($scope, APIapp) {
    
    $scope.cookey = Cookies.get("viewed");
    $scope.reloadPage = function(){window.location.reload();}
    
    $scope.locales = ["", "en_GB", "en_US", "fr_FR", "de_DE", "es_ES", "it_IT"];
    $scope.type = ["reviews", "questions"];
    $scope.limites = ["5", "10", "50", "100"];
    
    $scope.submitAPI = function() {
        APIapp.apibuilder($scope.passkey, $scope.types, $scope.staging);
    }
    
    $scope.checkAPI = function() {
        
        APIapp.apichecker($scope.api_URL);
    };
}]);


/*
    ******************************* BV API - Factory & Directives *******************************
*/

BV.factory("APIapp",['$http', '$window', '$q', '$rootScope', '$routeParams', '$location', '$route', '$timeout', function($http, $window, $q, $rootScope, $routeParams, $location, $route, $timeout) {
    
    $rootScope.oneAtATime = true;
    $rootScope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };
    
    return {
        apibuilder: function(apikey, apitype, stagingcheck) {
            
            $rootScope.api;
            $rootScope.prod_api ="http://api.bazaarvoice.com/data/";
            $rootScope.stg_api ="http://stg.api.bazaarvoice.com/data/";
            
            $rootScope.passkey = apikey;
            $rootScope.types = apitype;
            $rootScope.staging = stagingcheck;
        
    // *************** Environment check *************** 
            if ($rootScope.staging == true) {
                $rootScope.bv_api = $rootScope.stg_api + $rootScope.types + ".json?apiversion=5.4";
                $rootScope.api = $rootScope.stg_api + $rootScope.types + ".json?apiversion=5.4&passkey=";
                getData()
                $http.get($rootScope.stg_api + $rootScope.types + ".json?apiversion=5.4&passkey=" + $rootScope.passkey + "&limit=5").then(function(response) {
                    $rootScope.data_test = response.data;
                    console.log($rootScope.data_test);
                });
            } else {
                $rootScope.bv_api = $rootScope.prod_api + $rootScope.types + ".json?apiversion=5.4";
                $rootScope.api = $rootScope.prod_api + $rootScope.types + ".json?apiversion=5.4&passkey=";
                getData()
                $http.get($rootScope.prod_api + $rootScope.types + ".json?apiversion=5.4&passkey=" + $rootScope.passkey + "&limit=5").then(function(response) {
                    $rootScope.data_test = response.data;
                    console.log($rootScope.data_test);
                });
            }
    // *************** END of check ***************
            
            function getData() {
                if ($rootScope.passkey.length > 14) {
                    $http.get($rootScope.api + $rootScope.passkey).then(function(response) {
                        
                        console.log(response.data.HasErrors)
                        $rootScope.check = response.data.HasErrors;
                        $rootScope.apiURL = $rootScope.api + $rootScope.passkey;
                        
                        if($rootScope.check == false) {   
                            if ($rootScope.types == "reviews") {
                                $rootScope.data = response.data;
                                $rootScope.first_id = $rootScope.data.Results[0].ProductId;
                                console.log(response.data);
                            } else if ($rootScope.types == "questions") {
                                $rootScope.dataQA = response.data;
                                console.log($rootScope.dataQA);
                                $rootScope.first_id = $rootScope.dataQA.Results[0].ProductId;
                                $rootScope.q_first = $rootScope.dataQA.Results[0].Id;   
                            } else if ($rootScope.types == "authors") {
                                $rootScope.dataAuth = response.data;
                            } else if($rootScope.types == "products") {
                                $rootScope.dataProducts = response.data;
                            }
                        } else {
                            $rootScope.noapi = response.data.Errors["0"].Message;
                        }
                        
                    });
                } 
                else {
                    $rootScope.errormessage = "Invalid API KEY";
                }
            }
        },
        apichecker: function(URLAPI) {
            
            console.log(URLAPI);
            
            $rootScope.api_URL = URLAPI;
            
            if ($rootScope.api_URL.indexOf("&include=products") != -1) {
                checkAPIURL ()
            } else {
                $rootScope.api_URL = $rootScope.api_URL + "&include=products";
                checkAPIURL ();
            }
            
            function checkAPIURL () {     
                $http.get($rootScope.api_URL).then(function(response) { 
                    
                    $rootScope.apidata = response.data;
                    
                    if(response.data.HasErrors == true) {
                        $rootScope.errormessage = response.data.Errors["0"].Message;
                        $rootScope.errorCheck = response.data.HasErrors;
                    } else 
                    {
                        if ($rootScope.api_URL.indexOf("reviews.json") != -1) {
                            
                            $rootScope.apidata = response.data;
                            $rootScope.results = $rootScope.apidata.Results;
                            $rootScope.totalReviews = $rootScope.apidata.TotalResults;
                            $rootScope.Locale = $rootScope.apidata.Locale;
                            $rootScope.ratingsOnly = $rootScope.apidata.IsRatingsOnly;
                            $rootScope.apicalllimit = $rootScope.apidata.Limit;
                            
                            $rootScope.SyndicationCount = 0;
                            $rootScope.RatingsOnly = 0;
                            $rootScope.objectData = [];
                            
                            var up = false;
                            
                            if ($rootScope.apidata.Includes.Products.length > 0 || $rootScope.apidata.Includes.ProductsOrder.length > 0) {
                                $rootScope.ProductsData = $rootScope.apidata.Includes.Products;
                                $rootScope.ProductsAttributes = $rootScope.apidata.Includes.ProductsOrder;
                            }
                            
    // *************** Syndication function ***************
                            angular.forEach($rootScope.results, function(value, key) {    
                                $rootScope.resultsData = JSON.stringify(value.IsSyndicated);
                                $rootScope.ratingsOnlyReview = JSON.stringify(value.IsRatingsOnly);
                                
                                if ($rootScope.ratingsOnlyReview == "true") {
                                    $rootScope.RatingsOnly++
                                }
                                
                                if ($rootScope.resultsData == "true") {
                                    $rootScope.SyndicationCount++
                                    $rootScope.SReviews = {};
                                    $rootScope.SReviews ["id"] = value.Id;
                                    $rootScope.SReviews ["source"] = value.SyndicationSource.Name;
                            
                                    $rootScope.objectData.push($rootScope.SReviews);
                                }
                        
                            });
                            
                            $q.all($rootScope.objectData).then(function () {
                                $rootScope.SourcesSyndicated = $rootScope.objectData;
                            });  
    // *************** END Syndication ***************
                            
                            
    // *************** Client's Info function ***************
                            angular.forEach($rootScope.apidata.Includes.Products, function(value, key) {
                                
                                var reg = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gm;
                                    if(up != true) {
                                        var url = value.ProductPageUrl;
                                        up = true;
                                    }
                                var url = value.ProductPageUrl;
                                var regex = new RegExp(reg);
                                var resulti = regex.exec(url);
                                
                                if (resulti[1] != "null") {
                                    $rootScope.clientURL = resulti[0];
                                    $rootScope.client = resulti[1];   
                                }
                            });
                            
    // *************** END Syndication ***************
                            
    // *************** Pagination function ***************
                            $rootScope.limit = $rootScope.apidata.Limit;
                            $rootScope.page = ($rootScope.apidata.TotalResults / $rootScope.limit);
                            
                            if($rootScope.page != Math.floor($rootScope.page)) {
                                $rootScope.page = Math.floor($rootScope.page) + 1;
                                for (i = 0; i < $rootScope.page; i++) { 
                                    if(i == 0) {
                                        var api_URL = $rootScope.api_URL;
                                        $rootScope.pager = {
                                            urls : [{url: api_URL}]
                                        };
                                    } else {
                                        $rootScope.Offset = i * $rootScope.limit;
                                        $rootScope.pager.urls.push({'url' : $rootScope.api_URL + "&offset=" + $rootScope.Offset});
                                    }
                                }
                            }
                            
                            $rootScope.paginations = $rootScope.pager.urls;
    // *************** END Pagination ***************
                            
                        } else if ($rootScope.api_URL.indexOf(".xml?") != -1) {
                            $rootScope.api_URL = $rootScope.api_URL.replace(".xml?", ".json?");
                            $timeout(checkAPIURL (), 500);
                        } else if ($rootScope.api_URL.indexOf("questions.json") != -1) {
                            console.log($rootScope.apidata);
                            $rootScope.errormessage = "Not supported yet"; 
                        } else if ($rootScope.api_URL.indexOf("statistics.json") != -1) {
                            console.log($rootScope.apidata);
                            $rootScope.errormessage = "Not supported yet";
                        } else if($rootScope.api_URL.indexOf("reviewcomments.json") != -1) {
                            console.log($rootScope.apidata);
                            $rootScope.errormessage = "Not supported yet";
                        } else if($rootScope.api_URL.indexOf("answers.json") != -1) {
                            console.log($rootScope.apidata);
                            $rootScope.errormessage = "Not supported yet";
                        } else if ($rootScope.api_URL.indexOf("authors.json") != -1) {
                            console.log($rootScope.apidata);
                            $rootScope.errormessage = "Not supported yet";
                        } else if ($rootScope.api_URL.indexOf("products.json") != -1) {
                            console.log($rootScope.apidata);
                            $rootScope.errormessage = "Not supported yet";
                        } else {
                            $rootScope.errormessage = "Invalid API call";
                        }
                    } 
        
                });
            }
        }
    }
 }]); 