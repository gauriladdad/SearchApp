app.controller('searchResultsController', function ($scope, $resource) {
	
	$scope.searchQuery="";
	$scope.searchResult = [];
	$scope.totalRecordsCount = 0;
	 
	var duckduckgoAPI = $resource("https://api.duckduckgo.com",
		{ callback: "JSON_CALLBACK" },
		{ get: { method: "JSONP" }});

	$scope.search = function() {
		$scope.searchResult=[];
		
		duckduckgoAPI.get({ q: $scope.searchQuery , iax: 1, ia:"images", format:'json', pretty:1  }).$promise.then(
			function( result ) {
                $scope.searchResult=$scope.updateSearchResult(result);
                $scope.totalRecordsCount = $scope.searchResult.length;
            },
			function( error ) {
				$scope.searchResult = [];
				$scope.totalRecordsCount = 0;
			}
		);
	};
	
	$scope.updateSearchResult = function(result) {	
		return [];
	};	
});
