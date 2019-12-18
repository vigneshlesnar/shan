   	jQuery(document).ready(function ($) {
        "use strict";

		
	    var latitude = (typeof map_data.latitude !== 'undefined') ? map_data.latitude :34.038405;
	    var longitude = (typeof map_data.longitude !== 'undefined') ? map_data.longitude :-117.946944;
	    var markerImage = map_data.map_marker;
	    var mapTheme = map_data.map_theme;
	    var mapElement = "map";
	    google.maps.event.addDomListener(window, "load", simpleMap(latitude, longitude, markerImage, mapTheme, mapElement));


    }); 
