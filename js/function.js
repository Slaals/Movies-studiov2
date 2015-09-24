const NB_ELEMENT_STUB = 10; // Number of elements stubbed when needed
const PER_PAGE = 10;
const SCREEN_LIMIT = 1;

var page = 1;

var topElementsStubbed = [];
var bottomElementsStubbed = [];

var scrollMovement = false;

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
		// Retrieve movies and diplay them
		if( $( window ).height() + $( window ).scrollTop() == $( document ).height() ) {
			getDataPage();
		} 

		scrollMovement = true;
	});

	// Update movies when the scroll just mover every 1 second
	setInterval( function( ) {
		if( scrollMovement ) {
			updateMovies();
		}
	}, 1000 );

});

function updateMovies( ) {
	var topNode = $( '#movies-view' ).children( '.movie' ).first();
	var bottomNode = $( '#movies-view' ).children( '.movie' ).last();
	var limitDisplayTop = $( window ).scrollTop() - $( window ).height() * SCREEN_LIMIT;
	var limitDisplayBottom = $( window ).scrollTop() + $( window ).height() * ( SCREEN_LIMIT + 0.5 ); // +0.5 is useful for tests; but has to be deleted otherwise

	// Stub the top list and generate the bottom list
	if( topNode.offset().top < limitDisplayTop ) {
		for( i = 0; i < NB_ELEMENT_STUB; i++) {
			$( '#movies-view' ).children( '.movie' ).first().stubBackward();
		}

		var firstElement = bottomElementsStubbed.length - 1;
		for( i = firstElement; i >= bottomElementsStubbed.length - NB_ELEMENT_STUB; i-- ) {
			$( '#movies-view' ).children( '.bottom.stub' ).first().generateForward( i );
		}
	} 

	// Stub the bottom list and generate the top list
	if( bottomNode.offset().top > limitDisplayBottom ) {
		for( i = 0; i < NB_ELEMENT_STUB; i++) {
			$( '#movies-view' ).children( '.movie' ).last().stubForward();
		}

		var firstElement = topElementsStubbed.length - 1;
		for( i = firstElement; i >= firstElement - NB_ELEMENT_STUB; i-- ) {
			$( '#movies-view' ).children( '.top.stub' ).last().generateBackward( i );
		}

	} 

}

$.fn.generateBackward = function( index ) {
	$( this ).replaceWith( topElementsStubbed[index] );

	delete topElementsStubbed[index];
}

$.fn.generateForward = function( index ) {
	$( this ).replaceWith( bottomElementsStubbed[index] );

	delete bottomElementsStubbed[index];
}

$.fn.stubForward = function() {
	bottomElementsStubbed.push( $( this ).clone() );
	$( this ).replaceWith( "<div class='bottom stub'></div>" );
}

$.fn.stubBackward = function() {
	topElementsStubbed.push( $( this ).clone() );
	$( this ).replaceWith( "<div class='top stub'></div>" );
}

function getDataPage( ) {
	var res = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=" + page + "&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=" + PER_PAGE +"&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";

	$.getJSON( res, function( data ) {
		if( data.movies.length > 0 ) { // Page isn't full so it's considered to be the end
			var movies = data.movies;

			page += 1;

			for( i = 0; i < movies.length; i++ ) {
				$( '#movies-view' ).append( json2html.transform( movies[i], transform ) );
			}
		} 
	});
}
