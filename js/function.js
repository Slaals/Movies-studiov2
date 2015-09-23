const RES = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=1&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=10&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";

// Limit the nb of pages shown in the nav
const PAGES_BY_SPLIT = 5;

// Nb of movies by page
var nbMoviesPage = 1;

// Current pagination split
var currentSplit = 0;

var movies = [];

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
	
	// Get data and create fill the page nav
	$.getJSON( RES, function( data ) {
		movies = data.movies;

		definePagesLink( 0 );
	});

	$( '#movies-page' ).val( nbMoviesPage );

	$( '#page-prev' ).on( 'click', function() {
		selectPage( $( '#pages .page-link.selected' ).prev() );
	});

	$( '#page-next' ).on( 'click', function() {
		selectPage( $( '#pages .page-link.selected' ).next() );
	});

	$( '#page-split-left' ).on( 'click', function() {
		currentSplit -= 1;
		definePagesLink( 0 );
	});

	$( '#page-split-right' ).on( 'click', function() {
		currentSplit += 1;
		definePagesLink( 0 );
	});

	$( '#movies-page' ).on( 'keyup', function() {
		var inputVal = $( this ).val();

		// If it's not a digit
		if( ( /^\d+$/.test( inputVal ) === true ) && ( inputVal > 0 ) ) {
			nbMoviesPage = parseInt( inputVal );

			currentSplit = 0;

			definePagesLink( 0 );
		}
	});
});

function definePagesLink( index ) {
	var pages = $( '#pages' );

	pages.empty();

	for( i = 1; i <= getNbPagesBySplit(); i++ ) {
		$( '#pages' ).append( '<li class="page-link"><a>' + ( i + ( PAGES_BY_SPLIT * currentSplit ) ) + '</a></li>' );
	}

	selectPage( pages.children().eq( index ) );

	$( '#pages li' ).on( 'click', function() {
		selectPage( $(this) );
	});
}

function updateSplit( ) {
	var nbPagesBySplit = getNbPagesBySplit();

	$( '.page-split' ).addClass( 'hidden' );

	if( getMaxSplit() > 0 ) {
		if( ( currentSplit > 0 ) ) {
			$( '#page-split-left' ).removeClass( 'hidden' );
		} else if( currentSplit < getMaxSplit() - 1 ) {
			$( '#page-split-right' ).removeClass( 'hidden' );
		}
	}
}

function getNbPagesBySplit( ) {
	var nbPages;
	var pagesRemain = getNbPages() % PAGES_BY_SPLIT;

	if( pagesRemain > 0 ) {
		nbPages = pagesRemain; 
	} else {
		nbPages = PAGES_BY_SPLIT;
	}

	return nbPages;
}

function getNbPages( ) {
	return Math.ceil( movies.length / nbMoviesPage );
}

function getMaxSplit( ) {
	return Math.ceil( getNbPages() / PAGES_BY_SPLIT );
}

function selectPage( newPage ) {
	var pages = $( '#pages' ).children();
	var current = $( '#pages .page-link.selected' );

	updateSplit();

	if( getNbPages() == 1 ) {
		$( '.nav-arrow' ).addClass( 'hidden' );
	} else {
		$( '.nav-arrow' ).removeClass( 'hidden' );
		if( newPage.index() == 0 ) {
			$( '#page-prev' ).addClass( 'hidden' );
		} else if( newPage.index() == pages.last().index() ) {
			$( '#page-next' ).addClass( 'hidden' );
		} 
	}

	pages.removeClass( 'selected' );

	newPage.addClass( 'selected' );

	updateMoviesView( newPage.index() );
}

/*
 * Display the movie(s)
 */
function updateMoviesView( index ) {
	var container = $( '#movies-view' );
	var from = index * nbMoviesPage + ( PAGES_BY_SPLIT * currentSplit ); // From index 
	var to = from + nbMoviesPage; // To index

	container.empty();

	// Avoid array often in for loop below
	if( to > movies.length ) {
		to -= ( movies.length - from ) + 1;
	}

	for( i = from; i < to; i++ ) {
		container.append( json2html.transform( movies[i], transform ) );
	}
}