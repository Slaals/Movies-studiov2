var resources = "https://dev-api.streamnation.com/api/v1/movies?with_facets=false&page=1&sort_by=new_content&order=desc&watched=false&currently_playing_first=true&per_page=10&cover=low&fields=[%22name%22%2c%22cover%22]&x_api_version=2.0&auth_token=ap84WKgZ5rgy8Dmkamwe";

$(document).ready(function() {
	$.getJSON( resources, function( data ) {
		$.each( data.movies, function( key, val ) {
			val.name;
			val.cover;
		});

	});

	$.( '#page-left' ).on( 'click', function() {

	});

	$.( '#page-right' ).on( 'click', function() {

	});
});
