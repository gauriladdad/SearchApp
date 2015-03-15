app.controller('searchResultsController', function ($scope, $resource) {
	
	//the ng-model for storing search query entered by user
	$scope.searchQuery="";

	//this flag will help identify when to reload items in masonry
	$scope.reloadItemsInMasonry = false;
	
	/* This object maintains state of the result.
	totalRecordsCount - total number of records : 
	1. set to -1 instead of 0 so no records found link is not shown. 
	2. This is used to identify which section to show. (No records or images) 
	
	query - query string matching searchQuery
	
	searchResult - The array of icons based on searchQuery
	
	linkForMoreResults - When there are no records found, construct an URL to redirect user to duckduckgo search site
	*/
	$scope.searchResultData = {query: "", searchResult : [], totalRecordsCount: -1, linkForMoreResults:""};
	 
	/* create object with angularJS resource service to get data from duckduckgo API */
	var duckduckgoAPI = $resource("https://api.duckduckgo.com",
		{ callback: "JSON_CALLBACK" },
		{ get: { method: "JSONP" }});
	
	//imageLoaded function - flags the resultant images as loaded.
	$scope.imageLoaded = function( image ) {
		image.complete = true;
	};
				
	/* watch function -  is to identify when all the resultant images are loaded in browser
		This when complete - is the time masonry will be invoked */
	$scope.$watch('searchResultData.searchResult', function(value, oldValue) {
		for (var i=0;i<value.length;i++){
			if(value[i].complete === false){
				break;
			}
		}
		//if this condition is met, all the images are rendered in browser
		if(i > 0 && i === value.length){
			//if masonry already has items, then reload the items before drawing
			if($scope.reloadItemsInMasonry){				
				$('#imageContainer').masonry("reloadItems");
				$('#imageContainer').masonry();
			}			
			else if($scope.reloadItemsInMasonry === false){
				$('#imageContainer').masonry({
					"itemSelector": ".item",
					"columnWidth": ".grid-sizer",
				});	
				$scope.reloadItemsInMasonry = true;
			}				
		}
	}, true);
			
	
	/* search function - which will be invoked on search button click*/
	$scope.search = function() {
		//define initial value of search results array
		$scope.searchResultData.searchResult=[];
		$scope.searchResultData.query = $scope.searchQuery;
		//invoke get function on duckduckgo object
		duckduckgoAPI.get({ q: $scope.searchQuery , iax: 1, ia:"images", format:'json', pretty:1  }).$promise.then(
			//on success
			function( result ) {				
				var icons=[];
				/* Read each object present in RelatedTopics,
				It's either an Icon or Topics Array - which contains icon objects data */
				angular.forEach(result["RelatedTopics"], function(value, key) {
					if(value.hasOwnProperty('Topics'))	{
						angular.forEach(value["Topics"], function(topicValue, topicKey) {
							$scope.getIconsArray(icons, topicValue);
						});
					}
					else{
						$scope.getIconsArray(icons, value);
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
	
	/* updateIconsArray function - This function is used to populate icons array out of valueObject (e.g. icon/TopicsArray)*/
	$scope.getIconsArray = function (icons, valueObject) {		
		if($scope.isIcon(valueObject))
				{	
					iconObject={
						reference: valueObject["FirstURL"], 
						source: valueObject["Icon"]["URL"], 
						height: valueObject["Icon"]["Height"],
						width: valueObject["Icon"]["Width"],
						title: valueObject["Text"],
						//complete - is to identify if image has been rendered completely
						complete: false
					};
					//this is to avoid duplicate images being added in icons array
					if($scope.getItemIndexByField(icons, "source", iconObject.source) === -1){
						icons.push(iconObject);		
					}
				}
	}
	
	/* isIcon function - This function is used to identify if the valueObject contains icon related information */
	$scope.isIcon = function (valueObject)
	{		
		var iconAvailable =false;
		if(valueObject !== null && valueObject !== undefined && (valueObject.hasOwnProperty('Icon')))
		{
			var iconURL = valueObject["Icon"]["URL"];
			if(iconURL.length > 0 )
			{
				iconAvailable=true;	
			}			
		}
		return iconAvailable;
	};	

	/* getItemIndexByField function - This function returns index of an item where targetArrayItem.field matches sourceValue */
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