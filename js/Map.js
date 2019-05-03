/******************************

      AFFICHAGE DE LA MAP
     API LEAFLET ET MAPBOX

******************************/

// Fonction d'affichage de la carte et des marqueurs :
export function Map() {

	// Variable pour la clé de l'API Mapbox :
	const MAP_BOX_TOKEN = 'pk.eyJ1Ijoia2luZ29mYiIsImEiOiJjanRibzJ2b2MwaWtpNGJ0ZmZhYW9xbnB0In0.vWz6FyOCW94ScDgQt4CddQ';

	// Variable pour la map de la ville de Nantes :
	const nantesMap = L.map('map').setView([47.2175, -1.5577], 14);


	// Code issu de l'API Mapbox permettant d'afficher la carte sur le site :
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + MAP_BOX_TOKEN, {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: MAP_BOX_TOKEN
	}).addTo(nantesMap);


	this.addMarker = function(gps, options, callback) {
		L.marker(gps, options).addTo(nantesMap).on('click', callback);
	};
}
