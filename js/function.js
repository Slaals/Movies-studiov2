var resources = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=1&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=10&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";
var nbMoviesPage = 3;

var movies = [];

$(document).ready(function() {
	
	$.getJSON( resources, function( data ) {
		movies = data.movies;

		var nbPages = Math.ceil( movies.length / nbMoviesPage );

		for( i = 1; i <= nbPages; i++ ) {
			$( '#pages' ).append( '<li class="page-link"><a>' + i + '</a></li>' );
		}

		$( '#pages' ).children().first().addClass( 'selected' );

		updateMoviesView( 0 );
	});

	$( '#movies-page' ).val( nbMoviesPage );

	$( '#page-left' ).on( 'click', function() {
		currentSelected = $( '#pages .page-link.selected' );

		selectPage( currentSelected, currentSelected.prev() )
	});

	$( '#page-right' ).on( 'click', function() {
		currentSelected = $( '#pages .page-link.selected' );

		selectPage( currentSelected, currentSelected.next() )
	});
});

function selectPage( current, newPage ) {
	pages = $( '#pages' ).children();

	pages.removeClass( 'selected' );

	if( newPage.index() <= -1 ) {
		if( current.index() + 1 == pages.length ) {
			pages.first().addClass( 'selected' );
		} else {
			pages.last().addClass( 'selected' );
		}
	} else {
		newPage.addClass( 'selected' );
	}

	updateMoviesView( newPage.index() );
}

function updateMoviesView( index ) {
	container = $( '#movies-view' );

	container.empty();

	for( i = index; i < nbMoviesPage; i++ ) {
		container.append( '<div class="movie"></div>' );

		movie = container.children().last();

		movie.append( '<img class="cover" src="' + movies[i].cover + '"></img>' );
		movie.append( '<h2>' + movies[i].name + '</h2>');
	}
}
