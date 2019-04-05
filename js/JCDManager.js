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
	
	const onChooseStation = function(e) {
		console.log(e);
		console.log('Station clicked: ', e.target.options.stationId);
		console.log('Station clicked: ', stations[e.target.options.stationId]);
	};
	

	this.getStationsAsync = function() {
		getCallApi('stations', {contract: JCD_CONTRACT}, response => {
			// Récup des 10 premières stations seulement
			response = response.slice(0, 10);

			// Récup de la liste des stations et leur affichage sur la carte (méthode forEach)
			response.forEach(function(station) {
				console.log('station', station);
				const obj = new JCDStation(station);
				stations[station.number] = obj;
				map.addMarker(obj.gps, {stationId: obj.id, title: obj.name}, onChooseStation);
			});
		});
	};


	this.getStationsAsync();
};
