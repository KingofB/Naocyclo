/**
 * Classe des stations
 */
export class JCDStation
{
	//
	// FIXME : en option, stocker si on a une réservation en cours ici ou non. Ca fait double-sécurité quoi.
	//
	

	/**
	 *
	 * @param {Object} data
	 *
	 * @constructor
	 */
	constructor(data)
	{
		if (data === undefined)
			throw new Error("data need to be defined !");

		this.id = data.number;
		this.name = data.name.split('-').slice(1).join('-').trim();
		this.gps = [data.position.lat, data.position.lng];
		this.address = data.address;
		this.freeBikes = data.available_bikes;
	}




	/**
	 * Fonction d'ajustement du nombre de vélos disponibles lors d'une réservation
	 *
	 * @returns {boolean}
	 */
	reserveBike() {

		//
		// FIXME : pour plus de sécurité, vérifier si on a déjà une réservation en cours ici
		//

		if (this.freeBikes <= 0) {
			return false;
		}

		this.freeBikes--;
		return true;
	}

	/**
	 * Fonction d'ajustement du nombre de vélos disponibles lors d'une annulation de réservation
	 */
	cancelResa() {

		//
		// FIXME : pour + de sécurité, vérifier qu'on a bien une réservation en cours ici (le stocker, donc)
		//

		this.freeBikes++;
	}
}

