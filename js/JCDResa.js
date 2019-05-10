import { Popup } from './Popup.js';

/**
 * Module du formulaire de réservation
 *
 * 
 *
 * @constructor
 */
export function JCDResa()
{
	/**
	 * Pourcentage minimum de remplissage de la zone par la signature
	 *
	 * @private
	 *
	 * @type {number}
	 */
	const MIN_SIGNATURE_PERCENT_FILLED = 2;

	/**
	 * Nombre de lettres minimum du prénom et du nom
	 *
	 * @private
	 *
	 * @type {number}
	 */
	const MIN_NAME_LENGTH = 2;

	/**
	 * Contenu du formulaire
	 *
	 * @type {jQuery}
	 *
	 * @private
	 */
	const _$details = $('#station-details');

	/**
	 * Prénom (jQuery)
	 *
	 * @type {jQuery}
	 *
	 * @private
	 */
	const _$firstN = $('#firstname', _$details);

	/**
	 * Nom (jQuery)
	 *
	 * @type {jQuery}
	 *
	 * @private
	 */
	const _$lastN = $('#lastname', _$details);

	/**
	 * Reservation
	 * 
	 * @type {Object}
	 * 
	 * @private
	 */
	const _resa = {
		station: null,
		time: null
	};

	/**
	 * 
	 * 
	 * 
	 */
	const _popup = new Popup(document.getElementById('canvas-container'), {
		onValidate: () => app.canvas.storeImage(),
		onCancel: () => app.canvas.restoreImage(),
		onOpen: () => app.canvas.storeImage(),
		onInit: () => document.getElementById('clear-btn').addEventListener("click", app.canvas.clear)
	});



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
		_$details.show();
		$('#empty-state').hide();


		/**
		 * Encore + optimisé : combinaison de Object.entries() et de for...of
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
		 */
		//for (const [key, type] of Object.entries({name: 1, address: 1, freeBikes: 1, id: 0}))
		//	document.getElementById('station-' + key)[type ? 'innerHTML' : 'value'] = station[key];

		for (const property of ['name', 'address', 'freeBikes']) {
			_$details[0].querySelector('#station-' + property).innerHTML = station[property];
		}

		_$details[0].querySelector('#station-id').value = station.id;
	};





	function _cancelReservation() { 
		// FIXME
	}



	/**
	 * Effectuer la réservation
	 *
	 * @private
	 */
	function _makeReservation()
	{
		// Etape 1 : demande de confirmation (fonction "confirm()")
		// Etape 2 : vérifications
		// Etape 3 : mises à jour

		// FIXME : vérifier s'il y a déjà une réservation en cours
		_resa.station = document.getElementById('station-id').value;
		_resa.time = Date.now();

		const DURATION = 1200;

		sessionStorage.setItem('reservation', _resa);

		setTimeout(_cancelReservation, DURATION * 1000);
			

		// FIXME : vérifier que tout est bien défini dans le formulaire
		// FIXME       (normalement c'est déjà fait en amont... mais on n'est jamais trop prudents !)

		// FIXME : vérifier que la signature n'est pas vide
		// FIXME       (normalement c'est déjà fait en amont... mais on n'est jamais trop prudents !)





		// FIXME : enregistrer prénom et nom dans localStorage
		localStorage.setItem('lastname', _$lastN.val().trim());
		localStorage.setItem('firstname', _$firstN.val().trim());

		// FIXME : enregistrer la signature... où ça ? Que disent les specs ??
		sessionStorage.setItem('signature', canvas.saveCanvas());
		// FIXME : enregistrer la réservation ! (appeler la station, et lui dire de décrémenter les vélos dispos)
		// FIXME : peut-être avoir un objet global de réservations stocké dans sessionStorage/localStorage

		// Je remets ton ancien code ici. A voir où il faut le mettre exactement, et vérifier qu'il est correct (pas regardé encore)
		/**
		 // 	
		 // 	const bookingConfirm = document.createElement("p");
		 // 	bookingConfirm.textContent = "Votre réservation est validée. Elle expirera dans 20 minutes.";
		 // 	mapDiv.appendChild(bookingConfirm);
		 */
	}

	/**
	 * Callback appelé lorsqu'on enregistre le contenu de la popup de signature
	 *
	 * @private
	 */
	function _onSignatureUpdated()
	{
		_updateReservationBtn();
	}

	/**
	 * Met à jour le statut (actif/inactif) du bouton de validation du formulaire de réservation
	 *
	 * @private
	 */
	const _updateReservationBtn = () => {
		let ok = true;

		// FIXME : faire fonction de vérification + aboutie des champs nom et prénom

		// Attention aux leading/trailing spaces, on utilise trim() pour les enlever
		const firstN = _$firstN.val().trim();
		const lastN = _$lastN.val().trim();

		// On vérifie que les prénom et nom ont une longueur suffisante
		if (firstN.length < MIN_NAME_LENGTH || lastN.length < MIN_NAME_LENGTH)
			ok = false;

		// La signature doit couvrir au moins 2% (cf constante) de la surface de dessin
		if (canvas.getImageFilledPercent() < MIN_SIGNATURE_PERCENT_FILLED)
		{
			ok = false;
			alert('Votre signature est trop petite');
		}

		console.warn('update resa btn', canvas.getImageFilledPercent(), ok);

		$('#btn-reserve', _$details).attr('disabled', !ok);
	};

	/**
	 * Initialiser le module
	 *
	 * @private
	 */
	function _init()
	{
		// Prévenir la popup qu'on souhaite être avertis lorsque le contenu de la popup est enregistré
		popup.setSaveCallback(_onSignatureUpdated);

		// On désactive le bouton de réservation dès le début
		$('#btn-reserve', _$details).attr('disabled', true);

		// Quelques listeners...
		$('body')
			.on('click', '#signature .btn', popup.showPopup)
			.on('click', '#btn-reserve', _makeReservation)
			.on('input', '#firstname, #lastname', _updateReservationBtn)
		;
	}



	_init();
}
