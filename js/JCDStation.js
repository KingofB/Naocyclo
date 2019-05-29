/**
 * Classe des stations
 *
 * @param {Object} data
 *
 * @class
 */
export class JCDStation {
	constructor(data) {

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
	 * Fonction qui établit une station comme sélectionnée afin de changer son marqueur
	 *
	 * @param {boolean} selected
	 */
	setSelected(selected) {
		// Le double point d'exclamation sert a transformer une valeur en boolean :
		this.selected = !!selected;
		// Mise à jour de l'icône sur la carte
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

		this.updateIcon();

		return true;
	}

	/**
	 * Fonction d'ajustement du nombre de vélos disponibles lors d'une annulation de réservation
	 */
	cancelResa() {
		this.reserved = false;
		this.freeBikes++;

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
		// Attribuer le marqueur orange à une station réservée
		if (this.reserved) {
			this.marker.setIcon(window.app.map.orangeIcon);
			return;
		}

		// Attribuer le marqueur vert à une station sélectionnée
		if (this.selected) {
			this.marker.setIcon(window.app.map.greenIcon);
			return;
		}
		// Attribuer aux stations le maraueur bleu (par défaut) ou gris pour celles qui n'ont plus de vélos disponibles
		this.marker.setIcon(this.freeBikes > 0 ? window.app.map.blueIcon : window.app.map.greyIcon);
	}
}

