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
				$scope.searchResult=icons;
                $scope.totalRecordsCount = icons.length;
            },
			//on failure
			function( error ) {
				$scope.searchResult = [];
				$scope.totalRecordsCount = 0;
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
