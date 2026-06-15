/* This has been taken from http://www.bennadel.com/blog/2449-directive-link-observe-and-watch-functions-execute-inside-an-angularjs-context.htm
The extra code has been removed */
// I evaluate the given expression when the current image has loaded.
app.directive("imageLoad", function() {
				// I bind the DOM events to the scope.
				function link( $scope, element, attributes ) {

					// I evaluate the expression in the currently executing $digest - as such, there is no need
					// to call $apply().
					function handleLoadSync() {

						$scope.$eval( attributes.imageLoad );
					}

					// I evaluate the expression and trigger a subsequent $digest in order to let AngularJS
					// know that a change has taken place.
					function handleLoadAsync() {
						
						$scope.$apply(
							function() {

								handleLoadSync();

							}
						);

					}

					// Check to see if the image has already loaded.
					// If the image was pulled out of the browser
					// cache; or, it was loaded as a Data URI,
					// then there will be no delay before complete.
					if ( element[ 0 ].src && element[ 0 ].complete ) {
						handleLoadSync();
					// The image will be loaded at some point in the
					// future (ie. asynchronous to link function).
					} else {
						element.on( "load.imageLoad", handleLoadAsync );

					}


					// -------------------------------------- //
					// -------------------------------------- //

					// When the scope is destroyed, clean up.
					$scope.$on(
						"$destroy",
						function() {

							element.off( "load.imageLoad" );

						}
					);
				}

				// Return the directive configuration.
				return({
					link: link,
					restrict: "A"
				});
			});