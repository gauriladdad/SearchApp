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

		/* Read each object present in RelatedTopics,
		It's either an Icon or Topics Array - which contains icon objects data */
		angular.forEach(result["RelatedTopics"], function(value, key) {
			var iconURL;
			if(value.hasOwnProperty('Icon')){				
				iconObject = $scope.getIconObject(value);
				if(iconObject !== null && iconObject !== undefined)
					if($scope.getItemIndexByField(icons, "source", value["Icon"]["URL"]) === -1){
						icons.push(iconObject);									
					}					
			}			
			else if(value.hasOwnProperty('Topics'))	{
				angular.forEach(value["Topics"], function(topicValue, topicKey) {
					if(topicValue.hasOwnProperty('Icon')){				
						iconObject = $scope.getIconObject(topicValue);
						if(iconObject !== null && iconObject !== undefined){
							if($scope.getItemIndexByField(icons, "source", topicValue["Icon"]["URL"]) === -1){
								icons.push(iconObject);									
							}									
						}
					}
				});
			}			
		});			
		return icons;
	};

	$scope.getIconObject = function (valueObject){
		var iconObject;
		if($scope.isValidIcon(valueObject["Icon"]))
		{	
			iconObject={
					reference: valueObject["FirstURL"], 
					source: valueObject["Icon"]["URL"], 
					height: valueObject["Icon"]["Height"],
					width: valueObject["Icon"]["Width"],
					title: valueObject["Text"]
				};
		}
		return iconObject;
	};
	
	$scope.isValidIcon = function (iconObject)
	{		
		var iconAvailable =false;
		if(iconObject !== null && iconObject !== undefined && iconObject["URL"].length > 0)
		{
			iconAvailable=true;
		}
		return iconAvailable;
	};	

	$scope.getItemIndexByField = function(targetArray, field, sourceValue) {
		var targetArrayLen = targetArray.length;
		var itemIndex = -1;
		for(var i=0;i<targetArrayLen;i++) {
			if(targetArray[i][field] === sourceValue){
				itemIndex = i;
				break;
			}
		}
		return itemIndex;
	};
});
