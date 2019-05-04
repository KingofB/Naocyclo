export function JCDResa(popup)
{
	// Variable contenant le span de l'adresse de la station
	// const stationAddress = document.getElementById('station-address');
	// Variable contenant le span du nombre de vélos libres de la station
	// const stationBikes = document.getElementById('station-freeBikes');
	// Variable contenant le nom de l'utilisateur :
	// const userLastname = document.getElementById('lastname');
	// Variable contenant le prénom de l'utilisateur :
	// const userFirstname = document.getElementById('firstname');
	// Variable contenant le formulaire :
	// const form = document.querySelector("form");
	// Variable contenant le canvas :
	// const userSignature = document.querySelector('canvas');
	// Variable contenant la div map :
	// const mapDiv = document.getElementById("map");


	// let lastname = localStorage.getItem("lastname");
	// if (lastname) {
	// 	userLastname.value = lastname;
	// }
	//
	// let firstname = localStorage.getItem("firstname");
	// if (firstname) {
	// 	userFirstname.value = firstname;
	// }

	/**
	 * Mettre à jour le formulaire avec les données issues de la station choisie
	 *
	 * @public
	 *
	 * @param {Array} station
	 */
	this.updateFormForStation = function(station)
	{
		// Masquer l'empty state
		$('#station-details').show();
		$('#empty-state').hide();


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

	/**
	 * Effectuer la réservation
	 *
	 * @private
	 */
	function _makeReservation()
	{
		// FIXME : vérifier que tout est bien défini dans le formulaire
		// FIXME : vérifier que la signature n'est pas vide
		// localStorage.setItem('lastname', userLastname.value);
		// localStorage.setItem('firstname', userFirstname.value);
	}

	/**
	 * Initialiser le module
	 *
	 * @private
	 */
	function _init()
	{
		$('body')
			.on('click', '#signature .btn', popup.showPopup)
			.on('click', '#btn-reserve', _makeReservation)
		;
	}



	_init();


	// function recordBooking() {
	// 	const canvasImg = canvas.saveCanvas();
	// 	sessionStorage.setItem("canvasImg", canvasImg);
	// 	const bookingConfirm = document.createElement("p");
	// 	bookingConfirm.textContent = "Votre réservation est validée. Elle expirera dans 20 minutes.";
	// 	mapDiv.appendChild(bookingConfirm);
	// }
}
