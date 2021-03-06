var app = angular.module('DuckDuckGoSearchApp', ['ngRoute', 'ngResource', 'ui.bootstrap']);

/* configure the routes. */
app.config(function ($routeProvider) {
 
/*  We only have two routes as of now -> Search and About */
    $routeProvider.when("/", {
        controller: "searchResultsController",
        templateUrl: "app/views/searchresults.html"
    });		
	
	$routeProvider.when("/about", {
       templateUrl: "app/views/about.html"
    });
	
	/* return to URL /search when ever a matching URL is not found */
    $routeProvider.otherwise({ redirectTo: "/" });
 
});