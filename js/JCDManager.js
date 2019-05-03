import { JCDStation } from './JCDStation.js'


export function JCDManager(map) {
	// Variable pour la clé de l'API JC Decaux :
	const JCD_API_KEY = 'c35cfff362ee5fd3c47c1b8f34a85e02b7067d27';
	// Variable pour le "contract" de JCDecaux :
	const JCD_CONTRACT = 'Nantes';



	// Variable de la liste des stations de la ville :
	const stations = {};



	// Fonction centralisée permettant d'appeler l'API JCDecaux :
	const getCallApi = function(action, data, callback) {
		data = data || {};
		data.apiKey = JCD_API_KEY;

		$.get('https://api.jcdecaux.com/vls/v1/' + action, data, callback);
	};
	
	// Fonction affichant sur le formulaire les données de la station choisie :
	const onChooseStation = function(e) {
		
		const station = stations[e.target.options.stationId];
		

		/**
		 * Encore + optimisé : combinaison de Object.entries() et de for...of
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
		 */
		//for (const [key, type] of Object.entries({name: 1, address: 1, freeBikes: 1, id: 0}))
		//	document.getElementById('station-' + key)[type ? 'innerHTML' : 'value'] = station[key];
		
		
		for (const property of ['name', 'address', 'freeBikes']) {
			document.getElementById('station-' + property).innerHTML = station[property];
		}
		/*document.getElementById('station-name').innerHTML = station.name;
		document.getElementById('station-address').innerHTML = station.address;
		document.getElementById('station-freeBikes').innerHTML = station.freeBikes;*/
		
		document.getElementById('station-id').value = station.id;
	};
	

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


	
};
