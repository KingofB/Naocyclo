/**
 * Classe des stations
 */
export class JCDStation
{


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

		this.marker = null;
		this.selected = false;
		this.reserved = false;
	}




	/**
	 *
	 * @param {boolean} selected
	 */
	setSelected(selected) {
		// Le double point d'exclamation sert a transformer une valeur en boolean :
		// - une valeur "truthy" deviendra (boolean)true
		// - une valeur "falsy" deviendra (boolean)false
		this.selected = !!selected;
		this.updateIcon();
	}

	/**
	 * Fonction d'ajustement du nombre de vélos disponibles lors d'une réservation
	 *
	 * @returns {boolean}
	 */
	reserveBike() {
		if (!this.hasFreeBikes()) {
			return false;
		}

		this.reserved = true;
		this.freeBikes--;
		// Mettre à jour l'icône sur la map
		this.updateIcon();

		return true;
	}

	/**
	 * Fonction d'ajustement du nombre de vélos disponibles lors d'une annulation de réservation
	 */
	cancelResa() {
		this.reserved = false;
		this.freeBikes++;
		// Mettre à jour l'icône sur la map
		this.updateIcon();
	}

	/**
	 * Fonction renvoyant true pour les stations disposant de vélos libres
	 *
	 * @returns {boolean}
	 */
	hasFreeBikes() {
		return this.freeBikes > 0;
	}

	/**
	 * Fonction mettant à jour l'icône du marqueur sur la carte en fonction du statut de la station
	 *
	 *
	 */
	updateIcon() {
		// Dépend des statuts : réservé ou non, sélectionné ou non, vélos libres ou non
		if (this.reserved) {
			this.marker.setIcon(window.app.map.orangeIcon);
			return;
		}

		if (this.selected) {
			this.marker.setIcon(window.app.map.greenIcon);
			return;
		}

		this.marker.setIcon(this.freeBikes > 0 ? window.app.map.blueIcon : window.app.map.greyIcon);
	}
}

