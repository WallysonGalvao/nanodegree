// Define global variables for the map and infoWindows instances.
var map, locationsInfoWindow, service, bounds;

// Define the div that contains the Google map.
var mapDiv = document.getElementById('map');

var cityOfBrasilia = {
	lat: -15.798333,
	lng: -47.860437
};

// Store the map markers.
var markers = [];
// Store the places returned from the results callback.
var places = [];
// Store the position of the selected marker; undefined as page loads.
// As a marker is clicked, it stores its position inside the markers
// array; it is called to set the icon back to the original color when
// another marker is clicked.
var selectedMarker, selectedPlace, placeName;
// Store the map icon markers.
var greenIcon = 'img/green_marker.png';
var redIcon = 'img/red_marker.png';

// Create a map object and populate it with the result of the
// Google Places API input field.
function initMap() {
	// Create a new map JavaScript object using the coordinates
	// given by the center property.
	map = new google.maps.Map(mapDiv, {
		zoom: 15,
		center: cityOfBrasilia
	});
	// Initiate a text search by calling the PlacesService's textSearch() method.
	// Return information about a set of places based on a string.
	service = new google.maps.places.PlacesService(map);
	// Make the request to the Google Search Places API passing an initial value.
	getRequest('restaurants');
}

// Call the PlacesService's textSearch method passing a value for the
// request query.
function getRequest(value) {
	// Create a request for the service callback function.
	var request = {
		location: cityOfBrasilia,
		// Instruct the Places service to prefer showing results within this area.
		// If radius is turned on, the bounds parameter must be turned off.
		// radius: 500,
		// A google.maps.LatLngBounds object defining the rectangle in which to search.
		// If bounds is turned on, the radius parameter must be turned off.
		bounds: map.getBounds(),
		query: value
	};
	// Initiate a text search by calling the PlacesService's textSearch() method.
	// Return information about a set of places based on a string.
	service.textSearch(request, callback);
}

// Handle the status code passed in the maps 'PlacesServiceStatus' and the result object.
function callback(results, status) {
	// Check if the Places Service Status response is OK.
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// Empty the locations observable array.
		viewModel.locations.removeAll();
		// Make places and markers reference an empty array.
		places = [];
		markers = [];
		// Create an infoWindow instance.
		locationsInfoWindow = new google.maps.InfoWindow();
		// Loop over the results array returned by the callback.
		for (var i = 0; i < results.length; i++) {
			// Store the result.
			var place = results[i];
			// Insert the result into the places array.
			places.push(place);
			// Add a marker for this place.
			addMarker(place, i);
			// Insert a new LocationItem object for this place into the
			// ViewModel observable array locations.
			viewModel.locations.push(new LocationItem(place));
		}
		// Set query back to the empty string.
		// As the input text works both as textSearch for the Google Places API and
		// for the filter, the input text must be cleared after the results have been
		// stored to not interfere with the filter.
		viewModel.query('');
	} else {
		// Handle the case when the Google Places API returns an error.
		alert('Houve um problema ao entrar em contato com os servidores do Google. Por favor, verifique o console JavaScript para mais detalhes.');
		console.log(google.maps.places.PlacesServiceStatus);
	}
}

// Create a marker with an infoWindow and insert it into the 'markers' array.
// Create a list item connected to an appropriate marker.
function addMarker(place, listPos) {
	// Store the marker title.
	var locationName = place.name;
	// Define a variable to store the Wikipedia repsonse link.
	var wikiAPIStr;
	// Create a new marker for each place.
	var marker = new google.maps.Marker({
		// The position field of the Marker options object literal
		// taken by the google.maps.Marker constructor specifies a
		// LatLng identifying the location of the marker.
		position: place.geometry.location,
		// The map field specifies the Map on which to place the
		// marker; here the marker is attached to the map created
		// just above.
		map: map,
		title: locationName,
		id: listPos,
		visible: true
	});
	// Compose the Wikipedia URL search string with the search term. Query the Wikipedia
	// Code taken from the Wikipedia API lesson of the course.
	// Query the English Wikipedia API; to query the Italian API, change 'en' to 'it'.
	// var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
	var wikiUrl = 'https://pt.wikipedia.org/w/api.php?action=opensearch&search=' +
		locationName + '&format=json&callback=wikiCallback';

		// https://pt.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=${marker.title}&redirects=true
	// AJAX request object.
	$.ajax({
		url: wikiUrl,
		dataType: 'jsonp',
		success: function (response) {
			// Take the first element of the response Array as the article title.
			var articleTitle = response[0];
			// There may be more than one article in the response's 4th element. Take only the first link,
			// that should be the most representative.
			var articleUrl = response[3][0];
			// The AJAX response is an Array with 4 elements. The Wikipedia link that's of interest to the
			// marker infoWindow is stored at position 3 (of a 0-based array).
			// If the response array has a 4th element, compose the link; otherwise, provide a standard
			// replacement message.
			if (response[3].length > 0) {
				// Build the marker string.
				wikiAPIStr = '<p><a href="' + articleUrl + '" target="_blank">' + articleTitle + '</a></p>';
				// Add the string as a new marker property.
				marker.info = wikiAPIStr;
			} else {
				// Build the marker string.
				wikiAPIStr = '<p>Nenhum resultado foi encontrado na Wikipedia.</p>';
				// Add the string as a new marker property.
				marker.info = wikiAPIStr;
			}
		},
		// Handle error if the AJAX method fails to load the API.
		error: function (parsedjson, textStatus, errorThrown) {
			// Display the error message on the console to let the user have more details about it.
			console.log('parsedJSON: ' + parsedjson.statusText + ' ' + parsedjson.status);
			console.log('Error status: ' + textStatus);
			console.log('Error thrown: ' + textStatus);
			console.log('parsedJSON: ' + JSON.stringify(parsedjson));
			// Display a string prompting the user to check the console for details.
			wikiAPIStr = '<p> Ocorreu um erro ao carregar a API da Wikipedia. ' + '<br />' + 'Verifique o console para detalhes. </ p>';
			// Add the string as a new marker property.
			marker.info = wikiAPIStr;
		}
	});
	// Add an event listener to the marker.
	// Code taken from the Google Maps API section of the course and heavily adapted for this app.
	marker.addListener('click', function () {
		// Store the selected object from the locations observable array.
		var itemPos;
		// Check the locations observable array in the ViewModel to find the object that matches this
		// marker's title.
		for (var i = 0; i < viewModel.locations().length; i++) {
			if (locationName === viewModel.locations()[i].name) {
				itemPos = i;
			}
		}
		// Set the color of the marker and populates the infoWindow.
		selectRightLocation(this, itemPos, locationsInfoWindow);
	});
	// Insert the marker into the markers array.
	markers.push(marker);
}

// Tell the infoWindow to open at this marker and populate it with
// information specific to this marker.
// Code taken from the Google Maps API section of the course.
function populateInfoWindow(marker, infowindow) {
	// Store the marker title and a Wikipedia link.
	var content = '<div class="location-info"><div>' + marker.title + '</div>' +
		'<div>' + marker.info + '</div></div>';
	// Set the infoWindow content.
	infowindow.setContent(content);
	// Open the infoWindow.
	infowindow.open(map, marker);
	// Set the icon of the marker to green as the infowindow opens.
	marker.setIcon(greenIcon);
	// Center marker when it's active on click to provide better UX experience.
	map.panTo(marker.getPosition());
	// Set the boolean observable of the selected location to true to highlight
	// the corresponding list item.
	selectedPlace.currentSelection(true);
	// Make sure the marker and item properties are cleared if the infoWindow is closed.
	infowindow.addListener('closeclick', function () {
		// Check if there is a selected marker and a selected location.
		if (selectedMarker !== undefined && typeof (selectedPlace) !== 'undefined') {
			// Set the icon of the selected marker back to normal.
			markers[selectedMarker].setIcon(redIcon);
			// Remove the highlight from the selected list item.
			selectedPlace.currentSelection(false);
			// Close the infowindow.
			infowindow.close();
			// Remove the old references of the selected marker and item.
			selectedPlace = undefined;
			selectedMarker = undefined;
		}
	});
}

// Set the background color of the selected item and the color of the equivalent marker.
// Populate the appropriate infoWindow.
function selectRightLocation(marker, locationsPos, infowindow) {
	// Make sure the highlight property is removed from list items.
	viewModel.locations().forEach(function (location) {
		location.currentSelection(false);
	});
	// Check if there is a marker already selected; if there is one, set back its icon
	// to the normal red icon.
	if ((marker.id !== selectedMarker) && (selectedMarker !== undefined)) {
		markers[selectedMarker].setIcon(redIcon);
	}
	// Assign the current marker id to variable 'selectedMarker'.
	selectedMarker = marker.id;
	// Store the selected location object.
	selectedPlace = viewModel.locations()[locationsPos];
	// Store the name of the selected place taking it from the marker title.
	placeName = marker.title;
	// Change icon color of the selected marker and equivalent list item and populate the
	// info window.
	populateInfoWindow(marker, locationsInfoWindow);
}

// Display an error message to the user if the map fails to load.
function googleError() {
	// Set the control variable to true.
	viewModel.isError(true);
	return viewModel.message();
}

// Create a location object with a new property used to toggle a class in the CSS binding.
var LocationItem = function (data) {
	var self = this;
	self.name = data.name;
	self.geometry = data.geometry;
	// Boolean observable that is updated to true when this item is selected by the user.
	self.currentSelection = ko.observable(false);
};

// Knockout ViewModel.
//
// Store the locations as an observable array inside the ViewModel.
function LocationsViewModel() {
	var self = this;
	// Observable that holds the input value.
	self.query = ko.observable('');
	// Define an observable array that will hold the location objects.
	self.locations = ko.observableArray([]);
	// Observable variable that gets set to true if the 'onerror' callback is called by the
	// asynchronous call.
	self.isError = ko.observable(false);
	// Hold the error message content.
	var errorMessage = 'Algo deu errado ao carregar o Google Maps.' +
		'\nVerifique o console JavaScript para detalhes.';
	// Observable variable that holds the error message.
	self.message = ko.observable(errorMessage);
	// Observable for the error message font size.
	self.fontSize = ko.observable('x-large');
	// Knockout computed that returns a JavaScript object where the property names correspond to
	// style names and the values correspond to style values we wish to apply.
	self.fontSizeCSS = ko.computed(function () {
		return {
			'font-size': self.fontSize()
		};
	});
	// Provide a filter functionality that should filter (show or hide) the
	// existing list of locations as well as markers on the map.
	// It returns the matching subset of the original array of items.
	self.filteredLocations = ko.computed(function () {
		// Store the query term.
		var filter = self.query().toLowerCase();
		// Define an array to save the filtered locations.
		var newArr = [];
		// Check if the filter query is empty.
		if (!filter) {
			// Clear out the old locations from the observable array.
			self.locations.removeAll();
			// Set the visible property of each marker to true.
			markers.forEach(function (marker) {
				marker.setVisible(true);
			});
			// Loop over the original places array (the one that gets populated by
			// the API query).
			for (var i = 0; i < places.length; i++) {
				// Assign the current place to variable newPlace.
				var newPlace = places[i];
				// Assign a new LocationItem object with data taken from the current place.
				var selectedLocation = new LocationItem(newPlace);
				// Check if the selected marker was in the same position as this place is
				// in its places array. The markers array is generated from the Places API
				// results, as is the places array. So their element are always in sync.
				if (selectedMarker !== undefined && i === selectedMarker) {
					// Highlight this element.
					selectedLocation.currentSelection(true);
					// Give selected place reference to this element.
					selectedPlace = selectedLocation;
				}
				// Insert this element in the locations array.
				self.locations.push(selectedLocation);
			}
			return self.locations();
		} else {
			// Set the visible property of each marker to true.
			markers.forEach(function (marker) {
				marker.setVisible(false);
				// marker.setIcon(redIcon);
			});
			// Clear out the old locations from the observable array.
			self.locations.removeAll();
			// Define an array to store the positions of the item still visible after the filtering.
			var filtered = [];
			// Loop over the places array (the array that stores the Google API results).
			for (var i = 0; i < places.length; i++) {
				// Check if the current location name contains the search keyword regardless of
				// its position inside the location name.
				if (places[i].name.toLowerCase().indexOf(filter) >= 0) {
					// Store the current location.
					var newPlace = places[i];
					// Assign a new LocationItem object with data taken from the current place.
					var selectedLocation = new LocationItem(newPlace);
					// Check if the selected marker was in the same position as this place is
					// in its places array. The markers array is generated from the Places API
					// results, as is the places array. So their element are always in sync.
					if (selectedMarker !== undefined && i === selectedMarker) {
						// Highlight this element.
						selectedLocation.currentSelection(true);
						// Set the icon of the selected marker to green.
						markers[selectedMarker].setIcon(greenIcon);
						// Give selected place reference to this element.
						selectedPlace = selectedLocation;
					}
					// Insert this element in the locations array.
					self.locations.push(selectedLocation);
					// Check if the API has returned results and the markers array has values.
					if (markers.length > 0) {
						// As this element is visible because it matches the filter keyword,
						// highlight it.
						markers[i].setVisible(true);
						// As this element is visible because it matches the filter keyword,
						// insert it into the filtered array.
						filtered.push(i);
					}
				}
			}
			// Check if the old selected marker index is inside the filtered array (meaning
			// the array that stores the markers array indexes of the visible markers with
			// reference to the full markers array that is different from the locations array).
			if (selectedMarker !== undefined && filtered.indexOf(selectedMarker) < 0) {
				// Set its icon to red.
				markers[selectedMarker].setIcon(redIcon);
				// Close its infowindow.
				locationsInfoWindow.close();
				// Remove references from selected place and marker.
				selectedPlace = undefined;
				selectedMarker = undefined;
			}
			return self.locations();
		}
	});

	// Search the Google Places API if there is a valid string.
	self.searchPlacesAPI = function () {
		if (self.query() !== '') {
			getRequest(self.query());
		}
	};

	// Get the position of the selected item and select the equivalent marker.
	// As the markers array and the locations array are not in sync if the filter
	// has been used, this function performs different queries in the two arrays
	// places (which has equivalent elements to markers) and locations from ViewModel.
	self.selectListPlace = function (listPlace) {
		// Get the position of the marker equivalent to the selected location.
		var markerPos;
		for (var i = 0; i < places.length; i++) {
			if (listPlace.name === places[i].name) {
				markerPos = i;
			}
		}
		// Get the index position of the selected list item from the filtered list.
		var itemPos = self.locations.indexOf(listPlace);
		// Change icon color of the equivalent marker and populate its infoWindow.
		selectRightLocation(markers[markerPos], itemPos, locationsInfoWindow);
	};
}

// Instantiate a new LocationsViewModel object.
var viewModel = new LocationsViewModel();

// Activate KnockoutJS.
ko.applyBindings(viewModel);