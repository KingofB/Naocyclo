import { JCDStation } from './JCDStation.js';


/**
 * Classe de gestion JC Decaux
 *
 * @param {Function} cbStationsLoaded Fonction de callback appelée lorsque toutes les stations auront été récupérées depuis JCDecaux
 *
 * @constructor
 */
export function JCDManager(cbStationsLoaded)
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
	const _onChooseStation = e => window.app.resa.updateFormForStation(_stations[e.target.options.stationId]);




	//
	// FIXME : il manque une fonction pour récupérer une station par son ID !
	//          (sera utilisé dans JCDResa)
	//




	/**
	 * Initialiser le module :
	 * Récupérer la liste des stations JCDecaux et les enregistrer dans des JCDStation
	 *
	 * @private
	 */
	function _init()
	{
		_getCallApi('stations', {contract: JCD_CONTRACT}, response => {
			// // Récup des 10 premières stations seulement
			// response = response.slice(0, 10);

			// Récup de la liste des stations et leur affichage sur la carte (méthode forEach, synchrone)
			response.forEach(function(station) {
				const obj = new JCDStation(station);
				_stations[station.number] = obj;

				// Ajouter un marqueur sur la carte
				window.app.map.addMarker(obj.gps, {stationId: obj.id, title: obj.name}, _onChooseStation);
			});

			// Si quelqu'un souhaite être prévenu que toutes les stations sont chargées, on le prévient
			if (typeof cbStationsLoaded === 'function')
				cbStationsLoaded();
		});
	}



	_init();
}
