/**
 * Classe d'affichage de la carte et des marqueurs
 * Utilisation de l'API Leaflet et de Mapbox
 *
 * @constructor
 */
export function Map() {
	/**
	 * Variable pour la clé de l'API Mapbox
	 *
	 * @private
	 *
	 * @type {string}
	 */
	const MAP_BOX_TOKEN = 'pk.eyJ1Ijoia2luZ29mYiIsImEiOiJjanRibzJ2b2MwaWtpNGJ0ZmZhYW9xbnB0In0.vWz6FyOCW94ScDgQt4CddQ';

	/**
	 * Variable pour le réglage du zoom de la map
	 *
	 * @private
	 *
	 * @type {Object}
	 */
	const ZOOM = {
		default: 14,
		min: 12,
		max: 18
	};

	/**
	 * Variable pour la carte de la ville de Nantes (contract de JCDecaux)
	 *
	 * @private
	 */
	const _nantesMap = L.map('map').setView([47.2175, -1.5577], ZOOM.default);



	/**
	 * Variable d'icone verte pour la station sélectionnée
	 *
	 * @public
	 */
	this.greenIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	/**
	 * Variable d'icone grise pour les stations ne disposant pas de vélos
	 *
	 * @public
	 */
	this.greyIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	/**
	 * Variable d'icone orange, pour celle de la réservation en cours
	 *
	 * @public
	 */
	this.orangeIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	/**
	 * Variable d'icone bleue par défaut
	 *
	 * @public
	 */
	this.blueIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});




	/**
	 * Ajouter un marqueur sur la carte
	 *
	 * @public
	 *
	 * @param {Array} gps
	 * @param {Object} options
	 * @param {Function} callback
	 *
	 * @returns {L.Marker}
	 */
	this.addMarker = function(gps, options, callback) {
		// Pouvoir customiser l'icône
		/* @see https://leafletjs.com/reference-1.5.0.html#marker */
		// Si l'icône passée en paramètre est nulle ou undefined ou falsy (car dans ce cas, LeafLet crash),
		// et qu'on veut utiliser l'icône par défaut de LeafLeft, on supprime la clef "icon" dans "options"
		if (options && options.hasOwnProperty('icon') && !options.icon)
			delete options.icon;

		const marker = L.marker(gps, options);
		marker.addTo(_nantesMap).on('click', callback);

		return marker;
	};


	/**
	 * Initialiser le module
	 *
	 * @private
	 */
	function _init()
	{
		// Code issu de l'API Mapbox permettant d'afficher la carte sur le site :
		// @see https://leafletjs.com/reference-1.5.0.html#map-option
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + MAP_BOX_TOKEN, {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: ZOOM.max,
			minZoom: ZOOM.min,
			id: 'mapbox.streets',
			accessToken: MAP_BOX_TOKEN
		}).addTo(_nantesMap);
	}

	_init();
}
