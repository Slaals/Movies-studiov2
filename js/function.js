const ELEMENT_LIMIT = 10;

var page = 1;

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

	$( window ).scroll( function( ) {
		if( $( window ).height() + $( window ).scrollTop() == $( document ).height() ) {
			page += 1;
			getDataPage( )
		}
	});
});

function getDataPage( ) {
	var res = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=" + page + "&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=10&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";
	return $.getJSON( res, function( data ) {
		updateMoviesView( data.movies );
	});
}

/*
 * Display the movie(s)
 */
function updateMoviesView( movies ) {
	var container = $( '#movies-view' );

	/* if( container.children().length > ELEMENT_LIMIT ) {
		container.children().first().remove();
	}*/

	for( i = 0; i < movies.length; i++ ) {
		container.append( json2html.transform( movies[i], transform ) );
	}
}