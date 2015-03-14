app.controller('searchResultsController', function ($scope, $resource) {
	
	$scope.searchQuery="";

	/* This object maintains state of the result.
	total number of records : set to -1 instead of 0 so no records found link is not shown */
	$scope.searchResultData = {query: "", searchResult : [], totalRecordsCount: -1, linkForMoreResults:""};
	 
	/* create object with angularJS resource service to get data from duckduckgo API */
	var duckduckgoAPI = $resource("https://api.duckduckgo.com",
		{ callback: "JSON_CALLBACK" },
		{ get: { method: "JSONP" }});

	/* define search function - which will be invoked on search button click*/
	$scope.search = function() {
		//define intial value of search results array
		$scope.searchResultData.searchResult=[];
		$scope.searchResultData.query = $scope.searchQuery;
		//invoke get function 
		duckduckgoAPI.get({ q: $scope.searchQuery , iax: 1, ia:"images", format:'json', pretty:1  }).$promise.then(
			//on success
			function( result ) {

				var icons=[];
				/* Read each object present in RelatedTopics,
				It's either an Icon or Topics Array - which contains icon objects data */
				angular.forEach(result["RelatedTopics"], function(value, key) {
					if(value.hasOwnProperty('Topics'))	{
						angular.forEach(value["Topics"], function(topicValue, topicKey) {
							$scope.updateIconsArray(icons, topicValue);
						});
					}
					else{
						$scope.updateIconsArray(icons, value);
					}				
				});	
				$scope.searchResultData.searchResult=icons;
				$scope.searchResultData.totalRecordsCount = icons.length;
				if($scope.searchQuery.length > 0)
				{
					$scope.searchResultData.linkForMoreResults="https://duckduckgo.com/?q="+$scope.searchQuery;					
				}					
			},
			//on failure
			function( error ) {
				$scope.searchResultData.searchResult = [];
				$scope.searchResultData.totalRecordsCount = -1;
				$scope.searchResultData.linkForMoreResults="";									
			}
		);
	};
	
	$scope.updateIconsArray = function (icons, valueObject) {		
		if($scope.isIcon(valueObject))
				{	
					iconObject={
						reference: valueObject["FirstURL"], 
						source: valueObject["Icon"]["URL"], 
						height: valueObject["Icon"]["Height"],
						width: valueObject["Icon"]["Width"],
						title: valueObject["Text"]
					};
					if($scope.getItemIndexByField(icons, "source", iconObject.source) === -1){
						icons.push(iconObject);		
					}
				}
	}
	
	$scope.isIcon = function (valueObject)
	{		
		var iconAvailable =false;
		if(valueObject !== null && valueObject !== undefined && (valueObject.hasOwnProperty('Icon')))
		{
			var iconURL = valueObject["Icon"]["URL"];
			if(iconURL.length > 0 && iconURL.indexOf(".ico", iconURL.length - 4) === -1)
			{
				iconAvailable=true;	
			}			
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
