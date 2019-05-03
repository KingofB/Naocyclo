import { JCDStation } from './JCDStation.js'


export function JCDManager(map, canvas, resa) {
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
	const stations = {};



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
	const getCallApi = function(action, data, callback) {
		data = data || {};
		data.apiKey = JCD_API_KEY;

		$.get('https://api.jcdecaux.com/vls/v1/' + action, data, callback);
	};


	/**
	 * Fonction affichant sur le formulaire les données de la station choisie :
	 *
	 * @private
	 *
	 * @param {Event} e
	 */
	const onChooseStation = function(e) {

		resa.updateFormForStation(e.target.options.stationId);

	};


	/**
	 * Récupérer la liste des stations JCDecaux et les enregistrer dans des JCDStation
	 */
	this.getStationsAsync = function() {
		getCallApi('stations', {contract: JCD_CONTRACT}, response => {
			// Récup des 10 premières stations seulement
			response = response.slice(0, 10);

			// Récup de la liste des stations et leur affichage sur la carte (méthode forEach)
			response.forEach(function(station) {
				const obj = new JCDStation(station);
				stations[station.number] = obj;
				map.addMarker(obj.gps, {stationId: obj.id, title: obj.name}, onChooseStation);
			});
		});
	};



	this.getStationsAsync();
}
