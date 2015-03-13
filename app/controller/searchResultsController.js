app.controller('searchResultsController', function ($scope, $resource) {
	
	$scope.searchQuery="";

	//the object that will hold images data to be rendered on UI
	$scope.searchResult = [];

	//total number of records matching search criteria
	$scope.totalRecordsCount = 0;
	 
	/* create object with angularJS resource service to get data from duckduckgo API */
	var duckduckgoAPI = $resource("https://api.duckduckgo.com",
		{ callback: "JSON_CALLBACK" },
		{ get: { method: "JSONP" }});

	/* define search function - which will be invoked on search button click*/
	$scope.search = function() {
		//define intial value of search results array
		$scope.searchResult=[];
		
		//invoke get function 
		duckduckgoAPI.get({ q: $scope.searchQuery , iax: 1, ia:"images", format:'json', pretty:1  }).$promise.then(
			//on success
			function( result ) {

                $scope.searchResult=$scope.updateSearchResult(result);

                $scope.totalRecordsCount = $scope.searchResult.length;
            },
			//on failure
			function( error ) {
				$scope.searchResult = [];
				$scope.totalRecordsCount = 0;
			}
		);
	};
	
	/* updateSearchResult :- This function returns an array containing data of images matching search result
		input :- result : the result returned by duckduckgoAPI invokation
		output:- icons Array : the array holding icons information like - source, height, width etc.
	*/
	$scope.updateSearchResult = function(result) {	
		var icons=[];
		var iconObject;
		
		angular.forEach(result["RelatedTopics"], function(value, key) {
			var iconURL;
			if(value.hasOwnProperty('Icon')){
				
				if($scope.isIcon(value["Icon"]))
				{	
					iconObject={
						reference: value["FirstURL"], 
						source: value["Icon"]["URL"], 
						height: value["Icon"]["Height"],
						width: value["Icon"]["Width"],
						title: value["Text"]
					};				
					icons.push(iconObject);					
				}
			}
			//else read data from Topics object - which is an Array that contains icon objects data
		});			
		return icons;
	};
	
	
	$scope.isIcon = function (iconObject)
	{		
		var iconAvailable =false;
		if(iconObject !== null && iconObject !== undefined && iconObject["URL"].length > 0)
		{
			iconAvailable=true;
		}
		return iconAvailable;
	};	
});
