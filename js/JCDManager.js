import { JCDStation } from './JCDStation.js';


/**
 * Classe de gestion JC Decaux
 *
 * @param {Function} cbStationsLoaded Fonction de callback appelée lorsque toutes les stations auront été récupérées depuis JCDecaux
 * @param {Function} cbOnChooseStation Fonction de callback appelée lorsqu'on choisit une station JCDecaux sur la map
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
	 * Fonction centralisée permettant d'appeler l'API JCDecaux :
	 *
	 * @private
	 *
	 * @param {string} action
	 * @param {Object} data
	 * @param {Function} callback
	 *
	 */
	const _getCallApi = function(action, data, callback) {
		data = data || {};
		data.apiKey = JCD_API_KEY;

		$.get('https://api.jcdecaux.com/vls/v1/' + action, data, callback);
	};


	/**
	 * Fonction affichant sur le formulaire les données de la station choisie :
	 *
	 * @private
	 *
	 * @param {MouseEvent} e
	 */
	const _onChooseStation = e => {
		if (_currentStation) {
			_currentStation.setSelected(false);
		}

		_currentStation = _stations[e.target.options.stationId];
		_currentStation.setSelected(true);

		typeof cbOnChooseStation === 'function' && cbOnChooseStation(_currentStation);
	};


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
		if (!_stations.hasOwnProperty(id))
			throw 'ID non trouvé';

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
		_getCallApi('stations', {contract: JCD_CONTRACT}, response => {
			// Récup des 10 premières stations seulement
			response = response.slice(0, 10);

			// Récup de la liste des stations et leur affichage sur la carte (méthode forEach, synchrone)
			response.forEach(function(station) {
				const obj = new JCDStation(station);

				// Ajouter un marqueur sur la carte
				obj.marker = window.app.map.addMarker(obj.gps, {stationId: obj.id, title: obj.name}, _onChooseStation);
				obj.updateIcon();

				_stations[station.number] = obj;
			});

			// Si quelqu'un souhaite être prévenu que toutes les stations sont chargées, on le prévient
			if (typeof cbStationsLoaded === 'function')
				cbStationsLoaded();
		});
	}



	_init();
}
