import { Popup } from './Popup.js';
import {Canvas} from "./Canvas";

/**
 * Module du formulaire de réservation
 *
 * @constructor
 */
export function JCDResa() {
	/**
	 * Clef de réservation dans le sessionStorage
	 *
	 * @private
	 *
	 * @type {string}
	 */
	const SESSION_RESA = 'reservation';

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
	 * Durée de validité de la réservation
	 *
	 * @type {number}
	 */
	const DURATION = 1200;

	/**
	 * Contenu du formulaire
	 *
	 * @type {jQuery}
	 *
	 * @private
	 */
	const _$details = $('#station-details');

	/**
	 * Contenu de la section "#reservation-details"
	 * @private
	 *
	 * @type {jQuery}
	 */
	const _$sectionDetails = $('#reservation-details').hide();

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
	 * Canvas de signature
	 *
	 * @type {Canvas}
	 *
	 * @private
	 */
	const _canvas = new Canvas(document.querySelector('canvas'));

	/**
	 * Popup permettant de rentrer sa signature
	 *
	 * @type {Popup}
	 *
	 * @private
	 */
	const _popup = new Popup(document.getElementById('canvas-container'), {
		onValidate: () => _onSignatureUpdated(),
		onCancel: () => _canvas.restoreImage(),
		onOpen: () => _canvas.storeImage(),
		onInit: () => document.getElementById('clear-btn').addEventListener("click", _canvas.clear)
	});


	/**
	 *
	 * @type {JCDStation}
	 *
	 * @private
	 */
	let _currentStation = null;

	/**
	 *
	 * @type {number}
	 *
	 * @private
	 */
	let _resaTimer = null;

	/**
	 * Compte à rebours (setInterval)
	 *
	 * @type {number}
	 *
	 * @private
	 */
	let _clockTimer = null;




	/**
	 * Mettre à jour le formulaire avec les données issues de la station choisie
	 *
	 * @public
	 *
	 * @param {JCDStation} station
	 */
	this.updateFormForStation = function(station) {
		// On stocke la station actuellement cliquée par l'utilisateur
		_currentStation = station;

		// récupérer la valeur (trimmée) de prénom puis nom,
		// et pour chacun, si c'est vide, récupérer les valeurs dans localStorage (si elles existent)
		// et les mettre dans les champs avant d'afficher le formulaire
		if (!_$lastN.val().trim())
			_$lastN.val(localStorage.getItem('lastname'));

		if (!_$firstN.val().trim())
			_$firstN.val(localStorage.getItem('firstname'));

		// Au changement de station, vérifier que le bouton "réserver" est actif ou non.
		_updateReservationBtn();

		// Masquer l'empty state
		_$details.show();
		$('#empty-state').hide();

		// Mise à jour des données du formulaire concernant la station (nom, adresse et vélos libres)
		for (const property of ['name', 'address', 'freeBikes']) {
			_$details[0].querySelector('#station-' + property).innerHTML = _currentStation[property];
		}
		// Mise à jour de l'id de la station
		_$details[0].querySelector('#station-id').value = _currentStation.id;
	};


	/**
	 * Annuler une réservation
	 *
	 * @private
	 */
	function _cancelReservation() {
		// Vérifier s'il y a une réservation en cours et si non, sortir de la fonction
		if (!_resa.station) return;

		// Mettre à jour le nbre de vélos si la station est sélecionnée
		if (_currentStation && _currentStation.id == _resa.station) {
			const $nbFreeBikes = $('#station-freeBikes');
			$nbFreeBikes.text(Number($nbFreeBikes.text()) + 1);
		}

		// 2. récupérer la station liée à la réservation en cours
		const station = window.app.manager.getStation(_resa.station);
		// 3. appeler la fonction d'annulation sur la station
		station.cancelResa();
		// 4. nettoyer le sessionStorage
		sessionStorage.removeItem(SESSION_RESA);
		// 5. vider la zone HTML de description de la station en cours
		_$sectionDetails.find('> div').empty();
		_$sectionDetails.hide();
		// 6. stopper le setTimeout
		clearTimeout(_resaTimer);
		// 7. stopper le setInterval
		clearInterval(_clockTimer);
		// 8- remettre à vide la réservation
		_clearResa();
		// 9- mise à jour du bouton au cas où la station réservée était déjà sélectionnée
		_updateReservationBtn();
	}

	/**
	 * Fonction permettant de remettre à null les données de la réservation en local
	 *
	 * @private
	 */
	function _clearResa() {
		_resa.station = null;
		_resa.time = null;
	}


	/**
	 * Fonction qui lance tout ce dont il y a besoin pour une réservation lorsque celle-ci est détectée
	 *
	 * @param {boolean} pShouldReserveBike Indique si l'on doit effectuer la réservation de vélo sur la station ou pas.
	 *
	 * @private
	 */
	function _onResa(pShouldReserveBike) {
		const station = window.app.manager.getStation(_resa.station);
		// Faire une tentative de réservation de vélo sur la station avec _currentStation.reserveBike();
		// si le résultat est false, c'est que la réservation a échoué !!
		if (pShouldReserveBike && !station.reserveBike()) {
			sessionStorage.removeItem(SESSION_RESA);
			_clearResa();
			alert('Réservation impossible, pas de vélo disponible');
			return;
		}

		// Déclenchement du compte à rebours de la réservation
		// garder une référence au timeoutID retourné par setTimeout afin de pouvoir appeler clearTimeout, si on annule la réservation
		_resaTimer = setTimeout(_cancelReservation, DURATION * 1000 - (Date.now() - _resa.time));

		// Mettre à jour la zone de détails de la station (seulement si elle correspond à la station réservée !!)
		//          et diminuer de 1 le nombre de vélos disponibles
		// Tester _currentStation et mettre à jour le champ dans le formulaire via son ID
		if (_currentStation && _currentStation.id == _resa.station) {
			const $nbFreeBikes = $('#station-freeBikes');
			$nbFreeBikes.text(Number($nbFreeBikes.text()) - 1);
		}

		// Afficher les détails de la réservation dans la DIV prévue à cet effet
		_$sectionDetails.find('> div')[0].innerHTML = `<p>Votre vélo dans la station ${station.name} est réservé ! Votre réservation expirera dans <span class="clock"></span></p>
		<p><span class="btn btn-cancel-resa">Annuler</span></p>`;
		// On affiche la section
		_$sectionDetails.show();
		// On réinitialise le temps de la réservation
		_updateResaClock();
		// Utiliser un setInterval() pour le compte à rebours
		_clockTimer = setInterval(_updateResaClock, 50);
		// Repasser le bouton "réserver" en disabled
		_updateReservationBtn();
	}


	/**
	 * Effectuer la réservation
	 *
	 * @private
	 */
	function _makeReservation() {
		// Vérifier s'il y a déjà une réservation en cours, si oui l'annuler
		if (_resa.station) {

			if (confirm('Vous avez déjà une réservation en cours, souhaitez-vous la conserver ?')) {
				return;
			}

			_cancelReservation();
		}

		// On vérifie qu'une station est bien définie
		if (!_currentStation)
		{
			console.error('La station n\'est pas définie, cela ne devrait pas arriver');
			return;
		}

		// Vérifier que tout est bien défini dans le formulaire, et récupérer le prénom et le nom (nettoyés) de l'utilisateur.
		const res = _checkReservationInfo();
		if (!res)
		{
			console.error('Les infos de réservation ne sont pas bonnes, cela ne devrait pas arriver !');
			return;
		}

		// Vérifier la signature
		if (!_checkSignature())
			return;

		//  Faire une tentative de réservation sur la station
		if (!_currentStation.reserveBike()) {
			alert('Réservation impossible, pas de vélo disponible');
			return;
		}

		// Puisque les infos sont bonnes, on a donc en retour de la fonction _checkReservationInfo un tableau contenant deux éléments : le prénom et le nom.
		// On utilise donc ici la technique dite de "destructuring" pour récupérer le prénom et le nom dans deux variables distinctes.
		const [firstN, lastN] = res;

		// Enregistrer la réservation
		_resa.station = _currentStation.id;
		_resa.time = Date.now();

		// Enregistrement de la réservation dans sessionStorage
		sessionStorage.setItem(SESSION_RESA, JSON.stringify(_resa));

		// Enregistrer le prénom et le nom
		localStorage.setItem('lastname', firstN);
		localStorage.setItem('firstname', lastN);

		// Enregistrer la signature en session
		sessionStorage.setItem('signature', _canvas.saveCanvas());

		_onResa(false);
	}

	/**
	 * Met à jour le temps restant dans la section "#reservation-details"
	 *
	 * @private
	 */
	function _updateResaClock() {
		// S'il n'y a pas de réservation, on sort
		if (!_resa.station) return;

		// S'assurer que le temps ne soit pas déjà écoulé
		const elapsedTime = Date.now() - _resa.time;
		const remainingTime = DURATION * 1000 - elapsedTime;
		if (remainingTime <= 0)
		{
			_cancelReservation();
			return;
		}

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
		const clock = new Intl.DateTimeFormat('fr-FR', {minute: '2-digit', second: '2-digit'}).format(new Date(remainingTime));

		// Mettre à jour le span dans les details, avec "clock"
		_$sectionDetails.find('.clock').text(clock);
	}


	/**
	 * Callback appelé lorsqu'on enregistre le contenu de la popup de signature
	 *
	 * @private
	 */
	function _onSignatureUpdated()
	{
		_canvas.storeImage();

		// Afficher une alerte si la signature est trop petite
		_checkSignature();
	}

	/**
	 * Vérifier si la signature couvre suffisamment d'espace sur la zone de dessin
	 *
	 * @returns {boolean}
	 *
	 * @private
	 */
	function _checkSignature() {
		// La signature doit couvrir au moins 2% de la surface de dessin
		if (_canvas.getImageFilledPercent() < MIN_SIGNATURE_PERCENT_FILLED)
		{
			alert('Votre signature est trop petite');
			return false;
		}

		return true;
	}

	/**
	 * Met à jour le statut (actif/inactif) du bouton de validation du formulaire de réservation
	 *
	 * @private
	 */
	const _updateReservationBtn = () => {
		const $btn = $('#btn-reserve', _$details);

		if (_currentStation && _resa.station == _currentStation.id) {
			$btn.attr('disabled', true);
			return;
		}

		// Utiliser l'opérateur "not" pour convertir en boolean le résultat de l'appel à la fonction _checkReservationInfo().
		$btn.attr('disabled', !_checkReservationInfo());
	};

	/**
	 * Vérifier si les infos de la réservation sont valides (nom et prénom seulement, car la signature est vérifiée plus tard).
	 * Si oui retourne le prénom et nom, sinon retourne false.
	 *
	 * @returns {boolean|string[]}
	 *
	 * @private
	 */
	const _checkReservationInfo = () => {
		let ok = true;

		// Vérifier que les prénom et nom sont valides
		const firstN = _checkName(_$firstN.val());
		const lastN = _checkName(_$lastN.val());

		if (!firstN || !lastN)
			ok = false;

		// S'il y a un problème, on retourne false
		if (!ok)
			return false;

		// Sinon, on retourne le nom et le prénom
		return [firstN, lastN];
	};

	/**
	 * Vérifier si un nom est valide et modifier sa présentation si nécessaire
	 *
	 * @param {string} name
	 *
	 * @returns {string|boolean}
	 *
	 * @private
	 */
	const _checkName = name => {
		// Vérifier que name comporte une valeur ou qu'elle soit bien une string, si ce n'est psa le cas, on sort
		if (typeof name !== 'string' || !name)
			return false;

		// On utilise trim() pour enlever les éventuels espaces avant et après les noms saisis par l'utilisateur
		name = name.trim();

		// Vérifier si la taille du nom correspond à la taille minimale exigée
		if (name.length < MIN_NAME_LENGTH)
			return false;

		// 1. Remplacer d'éventuels tirets par des espaces (ex: "Charles-Henri") (String.replace())
		// 2. Découper la string en tableau par rapport au caractère "espace" (String.split())
		// 3. Parcourir la string et mettre la 1ère lettre en majuscule (Array.reduce())
		name = name
				.replace('-', ' ')
				.split(' ')
				.reduce((prev, cur) => prev + (!prev ? '' : ' ') + cur, '');

		// Pour finir, on retourne le nom ainsi préparé
		return name;
	};


	/**
	 * Callback appelé lorsque JCDManager a fini de charger toutes les stations JCDecaux
	 *
	 * @public
	 */
	this.onAllStationsLoaded = function()
	{
		// Détecter s'il y a une réservation en session (et si toutes les données de session sont valides).
		// Si oui, mettre à jour tout ce qu'il faut (zone HTML de détail de la réservation, setTimeout, setInterval, etc.
		const storedResa = sessionStorage.getItem(SESSION_RESA);
		if (!storedResa) return;

		const resaObj = JSON.parse(storedResa);
		if (Date.now() - resaObj.time >= DURATION * 1000) {
			sessionStorage.removeItem(SESSION_RESA);
			return;
		}

		_resa.station = resaObj.station;
		_resa.time = resaObj.time;

		// S'assurer qu'une station soit sélectionnée
		window.app.manager.setStation(_resa.station);

		_onResa(true);
	};


	/**
	 * Initialiser le module
	 *
	 * @private
	 */
	function _init()
	{
		// Désactiver le bouton de réservation dès le début
		$('#btn-reserve', _$details).attr('disabled', true);

		// Les listeners...
		$('body')
			.on('click', '#signature .btn', _popup.showPopup)
			.on('click', '#btn-reserve', _makeReservation)
			.on('click', '.btn-cancel-resa', _cancelReservation)
			.on('input', '#firstname, #lastname', _updateReservationBtn);
	}

	_init();
}
