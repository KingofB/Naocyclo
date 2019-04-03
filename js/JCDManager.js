
export function JCDApiClient() {
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

		return $.get('https://api.jcdecaux.com/vls/v1/' + action, data);

	};

	this.getStationsAsync = function(){
		return getCallApi('stations', {contract: JCD_CONTRACT});
	}



};
