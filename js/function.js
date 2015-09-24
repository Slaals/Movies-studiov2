const LIMIT_ELEMENT = 10;
const PER_PAGE = 10;

var page = 1;

var nbElementsDisplayed = 0;

var firstElementsRemoved = [];
var firstElementsRemoved = [];

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
		if( $( window ).scrollTop() == 0 ) {
			$( '#movies-view' ).regenerateFirstNode();
		}
	});

	$( window ).scroll( function( ) {
		if( $( window ).height() + $( window ).scrollTop() == $( document ).height() ) {
			getDataPage( )
		}
	});
});

function getDataPage( ) {
	var res = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=" + page + "&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=" + PER_PAGE +"&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";
	return $.getJSON( res, function( data ) {
		if( data.movies.length > 0 ) { // Page isn't full so it's considered to be the end
			var movies = data.movies;

			page += 1;

			for( i = 0; i < movies.length; i++ ) {
				$( '#movies-view' ).append( json2html.transform( movies[i], transform ) );
				nbElementsDisplayed += 1;
			}

			updateMoviesView( );
		}
	});
}

/*
 * Display the movie(s)
 */
function updateMoviesView( ) {
	if( nbElementsDisplayed > LIMIT_ELEMENT ) {
		var nbElementsToRemove = nbElementsDisplayed - LIMIT_ELEMENT;
		for( i = 0; i < nbElementsToRemove; i++ ) {
			$( '#movies-view' ).removeFirstNode();
		}
	}
}

$.fn.removeFirstNode = function( ) {
	var node = $( this ).children().first();

	firstElementsRemoved.push( node.clone() );

	node.remove();

	nbElementsDisplayed -= 1;
}

$.fn.regenerateFirstNode = function( ) {
	var firstElement = firstElementsRemoved.length;
	for( i = firstElement; i >= 0; i-- ) {
		$( '#movies-view' ).prepend( firstElementsRemoved[i] );
		delete firstElementsRemoved[i];
		nbElementsDisplayed += 1;
	}
}

$.fn.removeLastNode = function( ) {
	var node = $( this ).children().last();

	lastElementsRemoved.push( node.clone() );

	node.remove();

	nbElementsDisplayed -= 1;
}

$.fn.regenerateLastNode = function( ) {
	for( i = 0; i < lastElementsRemoved.length; i++ ) {
		$( '#movies-view' ).append( lastElementsRemoved[i] );
		delete lastElementsRemoved[i];
		nbElementsDisplayed += 1;
	}
}