import { Popup } from './Popup.js';
import {Canvas} from "./Canvas";



/**
 * Module du formulaire de réservation
 *
 * @constructor
 */
export function JCDResa()
{

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
	this.updateFormForStation = function(station)
	{
		// On stocke la station actuellement cliquée par l'utilisateur
		_currentStation = station;


		// récupérer la valeur (trimmée) de prénom puis nom
		//	et pour chacun, si c'est vide, récupérer les valeurs
		//	dans localStorage (si elles existent) et les foutre
		//	dans les champs avant d'afficher le formulaire
		if (!_$lastN.val().trim())
			_$lastN.val(localStorage.getItem('lastname'));

		if (!_$firstN.val().trim())
			_$firstN.val(localStorage.getItem('firstname'));

		// Au changement de station, vérifier que le bouton "réserver" est actif ou non.
		_updateReservationBtn();


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
			_$details[0].querySelector('#station-' + property).innerHTML = _currentStation[property];
		}

		_$details[0].querySelector('#station-id').value = _currentStation.id;
	};





	/**
	 * Annuler une réservation
	 *
	 * @private
	 */
	function _cancelReservation() {
		//
		// annuler la réservation !
		// 1. vérifier s'il y a une réservation en cours
		if (!_resa.station) return;

		// 2. récupérer la station liée à la réservation en cours
		const station = window.app.manager.getStation(_resa.station);
		// 3. appeler la fonction d'annulation sur la station
		station.cancelResa();
		// 4. nettoyer le sessionStorage
		sessionStorage.removeItem(SESSION_RESA);
		// 5. vider la zone HTML de description de la station en cours
		_$sectionDetails.find('> div').clear();
		_$sectionDetails.hide();
		// 6. stopper le setTimeout
		clearTimeout(_resaTimer);
		// 7. stopper le setInterval
		clearInterval(_clockTimer);
		// 8- remettre à vide la resa
		_clearResa();
	}

	/**
	 * Fonction permettant de remettre à null les données de la résa locale
	 *
	 * @private
	 */
	function _clearResa() {
		_resa.station = null;
		_resa.time = null;
	}


	/**
	 * Fonction qui lance tout ce dont il y a besoin pour une résa lorsque celle-ci est détectée
	 *
	 * @param {boolean} pShouldReserveBike Indique si l'on doit effectuer la réservation de vélo sur la station ou pas.
	 *
	 * @private
	 */
	function _onResa(pShouldReserveBike) {
		const station = window.app.manager.getStation(_resa.station);

		//
		//  faire une tentative de réservation sur la station avec _currentStation.reserveBike();
		//        Si le résultat est false, c'est que la réservation a échoué !!
		//
		if (pShouldReserveBike && !station.reserveBike()) {
			sessionStorage.removeItem(SESSION_RESA);
			_clearResa();
			alert('Réservation impossible, pas de vélo disponible');
			return;
		}

		// On déclenche le compte à rebours de la validité de la réservation...
		// garder une référence au timeoutID retourné par setTimeout afin de pouvoir appeler clearTimeout
		//          si on annule la réservation !!
		_resaTimer = setTimeout(_cancelReservation, DURATION * 1000 - (Date.now() - _resa.time));


		//
		// Afficher les détails de la réservation dans la DIV prévue à cet effet
		//
		// TODO : faire en sorte que le nom de la station soit un lien cliquable qui, lorsque cliqué, sélectionne (et centre) sur la map le marqueur correspondant
		_$sectionDetails.find('> div')[0].innerHTML = `<p>Votre vélo dans la station ${station.name} est réservé ! Votre réservation expirera dans <span></span></p>`;
		_updateResaClock();
		// On affiche la section
		_$sectionDetails.show();

		//const pShowResa = document.createElement('p');
		//pShowResa.textContent = 'Votre vélo dans la station ' + _resa.station.name + ' est réservé ! Celle-ci expirera dans ' + (_resaTimer / 60000) + 'minutes';
		//_$sectionDetails.appendChild(pShowResa);


		//
		// Utiliser un setInterval() pour le compte à rebours
		//
		_clockTimer = setInterval(_updateResaClock, 50);

		//
		// Repasser le bouton "réserver" en disabled
		//
		_updateReservationBtn();
	}


	/**
	 * Effectuer la réservation
	 *
	 * @private
	 */
	function _makeReservation()
	{

		// vérifier s'il y a déjà une réservation en cours, si oui l'annuler ! (après un confirm() bien sûr)
		//        (pour annuler une réservation : récupérer la station d'une manière ou d'une autre, et appeler cancelResa() dessus)
		//
		if (_resa.station) {

			if (confirm('Vous avez déjà une réservation en cours, souhaitez-vous la conserver ?')) {
				return;
			}

			_cancelReservation();
		}


		//
		// On vérifie qu'une station est bien définie
		//
		if (!_currentStation)
		{
			console.error('La station n\'est pas définie, cela ne devrait pas arriver');
			return;
		}


		// On vérifie une nouvelle fois que tout est bien défini dans le formulaire, et ça nous permet aussi
		// de récupérer par la même occasion le prénom et le nom (nettoyés) de l'utilisateur.
		// (sinon on serait obligés de le refaire ici, à moins de le stocker entre-temps...)
		const res = _checkReservationInfo(true);
		if (!res)
		{
			console.error('Les infos de réservation ne sont pas bonnes, cela ne devrait pas arriver !');
			return;
		}



		//
		//  faire une tentative de réservation sur la station avec _currentStation.reserveBike();
		//        Si le résultat est false, c'est que la réservation a échoué !!
		//
		if (!_currentStation.reserveBike()) {
			alert('Réservation impossible, pas de vélo disponible');
			return;
		}



		// Puisque les infos sont bonnes, on a donc en retour de la fonction _checkReservationInfo un tableau
		// contenant deux éléments : le prénom et le nom.
		// On utilise donc ici la technique dite de "destructuring" pour récupérer le prénom et le nom dans deux
		// variables distinctes.
		// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
		const [firstN, lastN] = res;



		//
		// On enregistre la réservation
		//
		_resa.station = _currentStation.id;
		_resa.time = Date.now();

		// Attention, la fonction setItem() prend en paramètre deux strings !!
		// @see https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
		// On enregistre dans sessionStorage car la réservation est annulée si on ferme le navigateur.
		sessionStorage.setItem(SESSION_RESA, JSON.stringify(_resa));

		// On enregistre le prénom et le nom pour plus tard (pas perdus si fermeture navigateur)
		localStorage.setItem('lastname', firstN);
		localStorage.setItem('firstname', lastN);

		// Les specs demandent d'enregistrer la signature en session
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

		// Sécurité pour s'assurer que le temps ne soit pas déjà écoulé
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
		_$sectionDetails.find('span').text(clock);
	}


	/**
	 * Callback appelé lorsqu'on enregistre le contenu de la popup de signature
	 *
	 * @private
	 */
	function _onSignatureUpdated()
	{
		_canvas.storeImage();

		_updateReservationBtn();
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

		/**
		 * On utilise l'opérateur "not" pour convertir en boolean le résultat de l'appel à la fonction _checkReservationInfo().
		 * Si la valeur est "truthy" (par exemple un tableau contenant prénom et nom),
		 *         alors le "not" transformera la valeur en boolean false.
		 * Si la valeur est "falsy",
		 *         alors le "not" transformera la valeur en boolean true.
		 *
		 * @see https://stackoverflow.com/a/784946
		 *
		 * On pourrait aussi utiliser "Boolean(_checkReservationInfo())" qui est plus long mais "théoriquement" moins error-prone que "!!_checkReservationInfo()".
		 *
		 * Perso j'aime l'efficacité et "l'expressiveness" comme on dit en anglais
		 */
		$btn.attr('disabled', !_checkReservationInfo(false));
	};

	/**
	 * Vérifie si les infos de la réservation sont valides. Si oui retourne le prénom et nom, sinon retourne false.
	 *
	 * @param {boolean} showAlert
	 *
	 * @returns {boolean|string[]}
	 *
	 * @private
	 */
	const _checkReservationInfo = showAlert => {
		let ok = true;

		// On vérifie que les prénom et nom sont valides
		const firstN = _checkName(_$firstN.val());
		const lastN = _checkName(_$lastN.val());

		if (!firstN || !lastN)
			ok = false;

		// La signature doit couvrir au moins 2% (cf constante) de la surface de dessin
		if (_canvas.getImageFilledPercent() < MIN_SIGNATURE_PERCENT_FILLED)
		{
			ok = false;
			if (showAlert) {
				alert('Votre signature est trop petite');
			}
		}

		// S'il y a un problème, on retourne false
		if (!ok)
			return false;

		// Sinon, on retourne le nom et le prénom
		return [firstN, lastN];
	};

	/**
	 * Vérifie si un nom est valide et le modifie sa présentation si nécessaire
	 *
	 * @param {string} name
	 *
	 * @returns {string|boolean}
	 *
	 * @private
	 */
	const _checkName = name => {
		// Vérification que name comporte une valeur ou qu'elle soit bien une string, si ce n'est psa le cas, on sort
		if (typeof name !== 'string' || !name)
			return false;

		// On utilise trim() pour enlever les éventuels espaces avant et après les noms saisis par l'utilisateur
		name = name.trim();

		//
		// TODO : faire d'autres nettoyages, par exemple n'accepter que lettres, apostrophe, trait d'union, point, espace.
		//          utiliser pour cela une RegExp (@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
		// Par exemple (doit toujours commencer par une lettre) :
		//       /^[A-Za-z][A-Za-z\.'- ]+$/.test(name)
		//

		// Vérifier si la taille du nom correspond au moins à la taille minimale exigée
		if (name.length < MIN_NAME_LENGTH)
			return false;

		// 1. Remplacer d'éventuels tirets par des espaces (ex: "Charles-Henri") (String.replace())
		// 2. Découper la string en tableau par rapport au caractère "espace" (String.split())
		// 3. Parcourir la string et mettre la 1ère lettre en majuscule (Array.reduce())
		name = name
				.replace('-', ' ')
				.split(' ')
				//.map(element => element.charAt(0).toUpperCase() + element.slice(1))
				//.join(' ')
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
		//
		//          Détecter s'il y a une réservation en session (et si toutes les données de session sont valides).
		//          Si oui, mettre à jour tout ce qu'il faut (zone HTML de détail de la réservation, setTimeout, setInterval, etc.
		//          SURTOUT (!!!) essayer de factoriser le code entre une réservation manuelle et une "réservation" ici.
		//
		const storedResa = sessionStorage.getItem(SESSION_RESA);
		if (!storedResa) return;

		const resaObj = JSON.parse(storedResa);
		if (Date.now() - resaObj.time >= DURATION * 1000) {
			sessionStorage.removeItem(SESSION_RESA);
			return;
		}

		_resa.station = resaObj.station;
		_resa.time = resaObj.time;

		_onResa(true);
	};



	/**
	 * Initialiser le module
	 *
	 * @private
	 */
	function _init()
	{
		// On désactive le bouton de réservation dès le début
		$('#btn-reserve', _$details).attr('disabled', true);

		// Quelques listeners...
		$('body')
			.on('click', '#signature .btn', _popup.showPopup)
			.on('click', '#btn-reserve', _makeReservation)
			.on('input', '#firstname, #lastname', _updateReservationBtn)
		;
	}



	_init();
}
