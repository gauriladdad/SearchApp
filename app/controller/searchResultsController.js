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
    "https://api.pexels.com/v1/search",
    {},
    {
      get: {
        method: "GET",
        headers: {
          Authorization:
            "Sq13OShoT6J365mp4wy0QNTr4k9hW1hy3cZ4lhNt6pkILDki6UuRe7mH",
        },
      },
    },
  );

  //imageLoaded function - flags the resultant images as loaded.
  $scope.imageLoaded = function (image) {
    image.complete = true;
    // Trigger masonry layout recalculation as each image loads
    setTimeout(function () {
      $("#imageContainer").masonry("reloadItems").masonry("layout");
    }, 0);
  };

  /* watch function -  is to identify when search results arrive
		Initialize masonry immediately, then refresh as images load */
  $scope.$watch(
    "searchResultData.searchResult",
    function (value, oldValue) {
      if (value.length > 0 && value !== oldValue) {
        // Initialize or reinitialize masonry as soon as results arrive
        setTimeout(function () {
          if (!$scope.reloadItemsInMasonry) {
            $("#imageContainer").masonry({
              itemSelector: ".item",
              columnWidth: ".grid-sizer",
            });
            $scope.reloadItemsInMasonry = true;
          } else {
            $("#imageContainer").masonry("reloadItems").masonry("layout");
          }
        }, 0);
      }
    },
    false,
  );

  /* search function - which will be invoked on search button click*/
  $scope.search = function () {
    //define initial value of search results array
    $scope.searchResultData.searchResult = [];
    $scope.searchResultData.query = $scope.searchQuery;
    //invoke get function on Pexels API

    pexelsAPI.get({ query: $scope.searchQuery, per_page: 30 }).$promise.then(
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
