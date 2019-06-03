import { JCDStation } from './JCDStation.js';

/**
 * Classe de gestion JC Decaux
 *
 * @param {Function} cbStationsLoaded Fonction de callback (cb) appelée lorsque toutes les stations auront été récupérées depuis JCDecaux
 * @param {Function} cbOnChooseStation Fonction de callback (cb) appelée lorsqu'on choisit une station JCDecaux sur la map
 *
 * @constructor
 */
export function JCDManager(cbStationsLoaded, cbOnChooseStation)
{
	/**
	 * Variable pour la clé de l'API JC Decaux :
	 *
	 * @private
	 *
	 * @type {string}
	 */
	const JCD_API_KEY = 'c35cfff362ee5fd3c47c1b8f34a85e02b7067d27';

	/**
	 * Variable pour le "contract" de JCDecaux :
	 *
	 * @private
	 *
	 * @type {string}
	 */
	const JCD_CONTRACT = 'Nantes';



	/**
	 * Variable de la liste des stations de la ville :
	 *
	 * @private
	 *
	 * @type {Object}
	 */
	const _stations = {};

	/**
	 * Station actuellement sélectionnée
	 *
	 * @private
	 *
	 * @type {JCDStation}
	 */
	let _currentStation = null;





	/**
	 * Fonction centralisée permettant d'appeler l'API JCDecaux (utilisation de jquery):
	 *
	 * @private
	 *
	 * @param {string} action String représentant l'API JCDecaux à appeler (par exemple "stations" pour récupérer toutes les stations)
	 * @param {Object} data Paramètres à fournir lors de l'appel à l'API JCDecaux
	 * @param {Function} callback Fonction de rappel lorsque le serveur JCDecaux a répondu à notre requête
	 *
	 */
	const _getCallApi = function(action, data, callback) {
		// Vérification si data est falsy et si oui, on le remplace par un objet vide
		data = data || {};
		data.apiKey = JCD_API_KEY;

		// Ici on utilise jquery, mais on pourrait utiliser l'Api Fetch en JS
		$.get('https://api.jcdecaux.com/vls/v1/' + action, data, callback);
	};


	/**
	 * Fonction affichant sur le formulaire les données de la station choisie :
	 *
	 * @private
	 *
	 * @param {TouchEvent|MouseEvent} e
	 */
	const _onChooseStation = e => {
		this.setStation(e.target.options.stationId);
	};

	/**
	 * Fonction qui définit la station qui est sélectionnée
	 *
	 * @public
	 *
	 * @param {number} id
	 */
	this.setStation = function(id) {
		// Vérification s'il existait déjà une station sélectionnée
		if (_currentStation) {
			// S'il y en a une, on la déselectionne
			_currentStation.setSelected(false);
		}

		// Dans tous les cas, on garde la station et on l'informe comme étant sélectionnée
		_currentStation = this.getStation(id);
		_currentStation.setSelected(true);

		// Vérification qu'on a bien un callback à appeler lorqu'on choisit une station
		// (cb passé au constructeur)
		// Un enchaînement de "ET" logiques est une autre manière d'écrire une imbrication de "if"
		typeof cbOnChooseStation === 'function' && cbOnChooseStation(_currentStation);
		//if (typeof cbOnChooseStation === 'function') {
		//	cbOnChooseStation(_currentStation);
		//}
	}

	/**
	 * Fonction pour récupérer une station par son id
	 *
	 * @public
	 *
	 * @param {number} id
	 *
	 * @returns {JCDStation}
	 */
	this.getStation = function(id) {
		// Vérifier si l'ID est une clef de notre Object "_stations".
		if (!_stations.hasOwnProperty(id))
			throw 'ID non trouvé';

		// Retourne la valeur dans "_stations" correspondant à l'id de station.
		return _stations[id];
	};






	/**
	 * Initialiser le module :
	 * Récupérer la liste des stations JCDecaux et les enregistrer dans des JCDStation
	 *
	 * @private
	 */
	function _init()
	{
		// @see : https://developer.jcdecaux.com/#/opendata/vls?page=dynamic
		_getCallApi('stations', {contract: JCD_CONTRACT}, response => {
			// Récup des 10 premières stations seulement car c'est pour l'exemple
			// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
			response = response.slice(0, 10);

			// Récup de la liste des stations et leur affichage sur la carte
			response.forEach(function(station) {
				const obj = new JCDStation(station);
				// Ajouter un marqueur sur la carte
				obj.marker = window.app.map.addMarker(obj.gps, {stationId: obj.id, title: obj.name}, _onChooseStation);
				obj.updateIcon();
				// Stocker à la clef correspondant à l'id de la station, la valeur qui est l'instance JCDStation créée ci-dessus
				// Lister toutes les stations et faire correspondre à l'ID l'instance de type JCDStation
				_stations[station.number] = obj;
			});

			// Si quelqu'un souhaite être prévenu que toutes les stations sont chargées, on le prévient
			if (typeof cbStationsLoaded === 'function')
				cbStationsLoaded();
		});
	}

	_init();
}
