var resources = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=1&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=10&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";
var nbMoviesPage = 1;

var movies = [];

$( document ).ready( function() {
	
	$.getJSON( resources, function( data ) {
		movies = data.movies;

		definePagesLink( 0 );
	});

	$( '#movies-page' ).val( nbMoviesPage );

	$( '#page-left' ).on( 'click', function() {
		selectPage( $( '#pages .page-link.selected' ).prev() );
	});

	$( '#page-right' ).on( 'click', function() {
		selectPage( $( '#pages .page-link.selected' ).next() );
	});

	$( '#movies-page' ).on( 'keyup', function() {
		var inputVal = $( this ).val();

		if( ( /^\d+$/.test( inputVal ) === false ) || ( inputVal <= 0 ) ) {
			// Alert (flash bag)
		} else {
			var index = $( '#pages .page-link.selected' ).index();

			nbMoviesPage = parseInt( inputVal );

			definePagesLink( index );

			updateMoviesView( index );
		}
	});
});

function definePagesLink( index ) {
	var pages = $( '#pages' );
	var nbPages = Math.ceil( movies.length / nbMoviesPage );

	pages.empty();

	for( i = 1; i <= nbPages; i++ ) {
		$( '#pages' ).append( '<li class="page-link"><a>' + i + '</a></li>' );
	}

	if( pages.children().index( index ) < 0 ) {
		selectPage( pages.children().first() );
	} else {
		selectPage( pages.children().eq( index ) );
	}

	$( '#pages li' ).on( 'click', function() {
		selectPage( $(this) );
	});
}

function selectPage( newPage ) {
	var index = 0;
	var pages = $( '#pages' ).children();
	var current = $( '#pages .page-link.selected' );

	pages.removeClass( 'selected' );

	if( newPage.index() <= -1 ) {
		if( current.index() + 1 == pages.length ) {
			pages.first().addClass( 'selected' );
		} else {
			pages.last().addClass( 'selected' );
			index = pages.length - 1;
		}
	} else {
		newPage.addClass( 'selected' );
		index = newPage.index();
	}

	updateMoviesView( index );
}

function updateMoviesView( index ) {
	var container = $( '#movies-view' );
	var from = nbMoviesPage * index;
	var to = from + nbMoviesPage;

	alert("from : " + from + " - to : " + to );

	if( to > movies.length ) {
		to = movies.length;
	}

	container.empty();

	for( i = from; i < to; i++ ) {
		container.append( '<div class="movie"></div>' );

		movie = container.children().last();

		movie.append( '<img class="cover" src="' + movies[i].cover + '"></img>' );
		movie.append( '<h3>' + movies[i].name + '</h3>');
	}
}
