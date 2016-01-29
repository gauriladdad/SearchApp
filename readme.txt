********** Purpose **********

This is a search application which allows user to search and browse various images matching to the search criteria. For retrieving results matching the search criteria, this application makes use of Duckduckgo API. 

As these images are loaded from all over the web each has a dynamic size and dynamic loading time hence the rendering part is the trickiest in this application.

********** Features **********
1. Search for images matching word or phrases
2. Hover over an image - show description of the image.
3. Click of an image - redirect the user to provide more details. 
4. No matching results found - user would be redirected suggesting possible results.
5. Retention of search history

********** Tools used **********
1. Github repository. 
2. AngularJS
3. Bootstrap style
4. Masonry grid layout library
5. Tomcat 7.0.59 server with Java 1.7 / MAMP

********** Device Support **********
1. This application works well on windows platforms various browsers like: Google chrome, IE and Mozilla Firefox. 
2. It also works well on devices like Apple IPad, Google nexus and Samsung galaxy note.
(Tested using Chrome emulator)

NOTE: 

1. The application uses some of the standards like dependency injection. The usage of 
AngularJS framework has enabled that to a great extend. 

********** Credits ********** 
1. Application development with AngularJS : https://angularjs.org/ (version 0.9.0)
2. Application wide CSS with Bootstrap : http://getbootstrap.com/
3. Full-screen responsive gallery using CSS and Masonry with Angular watch feature: http://creative-punch.net/2014/01/full-screen-image-gallery-using-css-masonry/
	
********** Future enhancements ********** 

1. Paginated view: This feature would paginate loading the images matching search criteria perhaps using the viewport height and width. This will certainly help improve application performance.

2. Expand image: This feature would allow user to view an expanded version of the image on single click in the same pane. (Something similar to what google search offers). While double click would take the user to page giving more information about the image.
