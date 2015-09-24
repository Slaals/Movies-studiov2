const NB_ELEMENT = 10;
const PER_PAGE = 10;

var page = 1;

var nbElementsDisplayed = 0;

var firstElementsStubbed = [];
var lastElementsStubbed = [];

var scrollMovement = false;

// TODO gérer avec le scroll ( delete en avant ou en arrière ... ) => STUB en utilisant la classe movie
// http://engineering.linkedin.com/linkedin-ipad-5-techniques-smooth-infinite-scrolling-html5

/*
 * <div class="movie">
 *  	<img></img>
 * 		<div class="title">
 * 			<p></p>
 * 		</div>
 * </div>
 */
var transform = { tag:'div', class:'movie', children:[
	{ tag:'img', class:'cover', src:'${cover}'},
	{ tag:'div', class:'title', children:[
		{ tag:'p', html:'${name}' } 
	] }
] };

$( document ).ready( function() {
	getDataPage( );

	$( window ).scroll( function() {
		if( $( window ).height() + $( window ).scrollTop() == $( document ).height() ) {
			getDataPage();
		} 

		scrollMovement = true;
	});

	setInterval( function( ) {
		if( scrollMovement ) {
			updateMovies();
		}
	}, 1000 );

});

function updateMovies( ) {
	var topNode = $( '#movies-view' ).children( '.movie' ).first();
	var bottomNode = $( '#movies-view' ).children( '.movie' ).last();
	var limitDisplayTop = $( window ).scrollTop() - $( window ).height();
	var limitDisplayBottom = $( window ).scrollTop() + $( window ).height() * 1.5;

	if( topNode.offset().top < limitDisplayTop ) {
		for( i = 0; i < NB_ELEMENT; i++) {
			var node = $( '#movies-view' ).children( '.movie' ).first();
			firstElementsStubbed.push( node.clone() );
			node.replaceWith( "<div class='first stub'></div>" );
		}

		var firstElement = lastElementsStubbed.length - 1;
		for( i = firstElement; i >= lastElementsStubbed.length - NB_ELEMENT; i-- ) {
			var node = $( '#movies-view' ).children( '.last.stub' ).first();
			node.replaceWith( lastElementsStubbed[i] );

			delete lastElementsStubbed[i];
			nbElementsDisplayed += 1;
		}
	} 

	if( bottomNode.offset().top > limitDisplayBottom ) {
		var node;
		for( i = 0; i < NB_ELEMENT; i++) {
			node = $( '#movies-view' ).children( '.movie' ).last();
			lastElementsStubbed.push( node.clone() );
			node.replaceWith( "<div class='last stub'></div>" );
		}

		var firstElement = firstElementsStubbed.length - 1;
		for( i = firstElement; i >= firstElement - NB_ELEMENT; i-- ) {
			var node = $( '#movies-view' ).children( '.first.stub' ).last();
			node.replaceWith( firstElementsStubbed[i] );

			delete firstElementsStubbed[i];
			nbElementsDisplayed += 1;
		}

	} 

}

function getDataPage( ) {
	var res = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=" + page + "&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=" + PER_PAGE +"&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";

	$.getJSON( res, function( data ) {
		if( data.movies.length > 0 ) { // Page isn't full so it's considered to be the end
			var movies = data.movies;

			page += 1;

			for( i = 0; i < movies.length; i++ ) {
				$( '#movies-view' ).append( json2html.transform( movies[i], transform ) );
				nbElementsDisplayed += 1;
			}
		} 
	});
}

$.fn.stub = function( classes ) {
	$( this ).replaceWith( '<div class="' + classes + '"></div>' );
}
