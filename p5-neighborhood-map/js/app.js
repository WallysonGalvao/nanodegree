var map, locationsInfoWindow, service, bounds;

// Defina a div que contém o mapa do Google.
var mapDiv = document.getElementById('map');
var markers = [];
var places = [];
var selectedMarker, selectedPlace, placeName;

var city = {
	lat: -15.798333,
	lng: -47.860437
};

function initMap() {
	map = new google.maps.Map(mapDiv, {
		zoom: 15,
		center: city
	});
	service = new google.maps.places.PlacesService(map);
	getRequest('restaurants');
}

// Chame o método textSearch do PlacesService passando um valor para o
// request query.
function getRequest(value) {
	var request = {
		location: city,
		bounds: map.getBounds(),
		query: value
	};
	service.textSearch(request, callback);
}

// Lida com o código de status passado no mapa 'PlacesServiceStatus' e o objeto de resultado.
function callback(results, status) {

	if (status == google.maps.places.PlacesServiceStatus.OK) {
		viewModel.locations.removeAll();
		places = [];
		markers = [];
		locationsInfoWindow = new google.maps.InfoWindow();

		results.forEach((result, index) => {
			places.push(result);
			addMarker(result, index);
			viewModel.locations.push(new locationItem(result));
		});
		viewModel.query('');
	} else {
		alert('Houve um problema ao entrar em contato com os servidores do Google. Por favor, verifique o console JavaScript para mais detalhes.');
		console.log(google.maps.places.PlacesServiceStatus);
	}
}

// Cria um marcador com uma infoWindow e insere no array de 'marcadores'.
function addMarker(place, listPos) {
	var locationName = place.name;

	var wikiApi;

	var marker = new google.maps.Marker({
		position: place.geometry.location,
		map: map,
		title: locationName,
		id: listPos,
		visible: true
	});
	var url = `https://pt.wikipedia.org/w/api.php?action=opensearch&search=${locationName}&format=json&callback=wikiCallback`;

	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: response => {
			var articleTitle = response[0];
			var articleUrl = response[3][0];
			if (response[3].length > 0) {
				wikiApi = `<p><a href="${articleUrl}" target="_blank">${articleTitle}</a></p>`;
				marker.info = wikiApi;
			} else {
				wikiApi = '<p>Nenhum resultado foi encontrado na Wikipedia.</p>';
				marker.info = wikiApi;
			}
		},
		error: (parsedjson, textStatus) => {
			console.log(`parsedJSON: ${parsedjson.statusText} ${parsedjson.status}`);
			console.log(`Error status: ${textStatus}`);
			console.log(`parsedJSON: ${JSON.stringify(parsedjson)}`);
			wikiApi = '<p> Ocorreu um erro ao carregar a API da Wikipedia. <br />' + 'Verifique o console para detalhes. </ p>';
			marker.info = wikiApi;
		}
	});

	marker.addListener('click', function () {
		var itemPos;
		viewModel.locations().forEach((location, index) => {
			if (locationName === location.name) {
				itemPos = index;
			}
		});
		selectRightLocation(this, itemPos, locationsInfoWindow);
	});

	markers.push(marker);
}

// infoWindow abre o marcador e popula com informações específicas.
function populateInfoWindow(marker, infowindow) {
	infowindow.setContent(`<div class="location-info"><div>${marker.title}</div> <div>${marker.info}</div></div>`);
	infowindow.open(map, marker);
	map.panTo(marker.getPosition());
	selectedPlace.currentSelection(true);
	infowindow.addListener('closeclick', function () {
		if (selectedMarker !== undefined && typeof (selectedPlace) !== 'undefined') {
			selectedPlace.currentSelection(false);
			infowindow.close();
			selectedPlace = undefined;
			selectedMarker = undefined;
		}
	});
}

// Defina a cor de fundo do item selecionado e a cor do marcador.
function selectRightLocation(marker, locationsPos) {
	viewModel.locations().forEach(location => location.currentSelection(false));
	selectedMarker = marker.id;
	selectedPlace = viewModel.locations()[locationsPos];
	placeName = marker.title;
	populateInfoWindow(marker, locationsInfoWindow);
}

function mapFail() {
	viewModel.isError(true);
	return viewModel.message();
}

var locationItem = function (data) {
	this.name = data.name;
	this.geometry = data.geometry;
	this.currentSelection = ko.observable(false);
};

// Armazena os locais com um array dentro do ViewModel.
function LocationsViewModel() {
	var that = this;

	this.query = ko.observable('');

	this.locations = ko.observableArray([]);

	this.isError = ko.observable(false);

	var errorMessage = `Algo deu errado ao carregar o Google Maps. \nVerifique o console JavaScript para detalhes.`;

	this.message = ko.observable(errorMessage);

	this.fontSize = ko.observable('x-large');
	this.fontSizeCSS = ko.computed(function () {
		return {
			'font-size': that.fontSize()
		};
	});
	this.arrLocations = ko.computed(function () {
		var filter = that.query().toLowerCase();
		if (!filter) {
			that.locations.removeAll();
			markers.forEach(function (marker) {
				marker.setVisible(true);
			});
			places.forEach((newPlace, index) => {
				var selectedLocation = new locationItem(newPlace);
				if (selectedMarker !== undefined && index === selectedMarker) {
					selectedLocation.currentSelection(true);
					selectedPlace = selectedLocation;
				}
				that.locations.push(selectedLocation);
			});

			return that.locations();
		} else {
			markers.forEach(function (marker) {
				marker.setVisible(false);
			});
			that.locations.removeAll();
			var filtered = [];
			places.forEach((newPlace, index) => {
				if (newPlace.name.toLowerCase().indexOf(filter) >= 0) {
					var selectedLocation = new locationItem(newPlace);
					if (selectedMarker !== undefined && index === selectedMarker) {
						selectedLocation.currentSelection(true);
						selectedPlace = selectedLocation;
					}
					that.locations.push(selectedLocation);
					if (markers.length > 0) {
						markers[index].setVisible(true);
						filtered.push(index);
					}
				}
			});

			if (selectedMarker !== undefined && filtered.indexOf(selectedMarker) < 0) {
				locationsInfoWindow.close();
				selectedPlace = undefined;
				selectedMarker = undefined;
			}
			return that.locations();
		}
	});
	this.searchPlaces = function () {
		if (that.query() !== '') {
			getRequest(that.query());
		}
	};
	this.selectListPlace = function (listPlace) {
		var markerPos;
		places.forEach((place, index) => {
			if (listPlace.name === place.name) {
				markerPos = index;
			}
		});

		var itemPos = that.locations.indexOf(listPlace);
		selectRightLocation(markers[markerPos], itemPos, locationsInfoWindow);
	};
}

// Instancia uma nova LocationsViewModel.
var viewModel = new LocationsViewModel();

ko.applyBindings(viewModel);