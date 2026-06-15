app.controller("searchResultsController", function ($scope, $resource) {
  //the ng-model for storing search query entered by user
  $scope.searchQuery = "";

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
  $scope.searchResultData = {
    query: "",
    searchResult: [],
    totalRecordsCount: -1,
    linkForMoreResults: "",
  };

  /* create object with angularJS resource service to get data from Pexels API */
  var pexelsAPI = $resource(
    "http://localhost:3000/search",
    {},
    {
      get: {
        method: "GET",
      },
    },
  );

  //imageLoaded function - flags the resultant images as loaded.
  $scope.imageLoaded = function (image) {
    image.complete = true;
  };

  /* watch function -  is to identify when all the resultant images are loaded in browser
		This when complete - is the time masonry will be invoked */
  $scope.$watch(
    "searchResultData.searchResult",
    function (value, oldValue) {
      for (var i = 0; i < value.length; i++) {
        if (value[i].complete === false) {
          break;
        }
      }
      //if this condition is met, all the images are rendered in browser
      if (i > 0 && i === value.length) {
        //if masonry already has items, then reload the items before drawing
        if ($scope.reloadItemsInMasonry) {
          $("#imageContainer").masonry("reloadItems");
          $("#imageContainer").masonry();
        } else if ($scope.reloadItemsInMasonry === false) {
          $("#imageContainer").masonry({
            itemSelector: ".item",
            columnWidth: ".grid-sizer",
          });
          $scope.reloadItemsInMasonry = true;
        }
      }
    },
    true,
  );

  /* search function - which will be invoked on search button click*/
  $scope.search = function () {
    //define initial value of search results array
    $scope.searchResultData.searchResult = [];
    $scope.searchResultData.query = $scope.searchQuery;
    //invoke get function on Pexels API

    pexelsAPI.get({ query: $scope.searchQuery, per_page: 80 }).$promise.then(
      //on success

      function (result) {
        var icons = [];
        /* Read each object present in results array from Pexels */
        angular.forEach(result.photos, function (photo, key) {
          iconObject = {
            reference: photo.photographer_url,
            source: photo.src.medium,
            height: photo.height,
            width: photo.width,
            title: photo.photographer + " - " + photo.alt,
            //complete - is to identify if image has been rendered completely
            complete: false,
          };
          icons.push(iconObject);
        });
        $scope.searchResultData.searchResult = icons;

        $scope.searchResultData.totalRecordsCount = icons.length;

        if ($scope.searchQuery.length > 0) {
          $scope.searchResultData.linkForMoreResults =
            "https://www.pexels.com/search/" +
            encodeURIComponent($scope.searchQuery);
        }
      },
      //on failure
      function (error) {
        $scope.searchResultData.searchResult = [];
        $scope.searchResultData.totalRecordsCount = -1;
        $scope.searchResultData.linkForMoreResults = "";
      },
    );
  };
});
