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
		// FIXME : annuler la réservation !
		//          1. vérifier s'il y a une réservation en cours
		//          2. récupérer (d'une manière ou d'une autre, genre via window.app.manager...) la station liée à la réservation en cours
		//          3. appeler la fonction d'annulation sur la station
		//          4. nettoyer le sessionStorage
		//          5. vider la zone HTML de description de la station en cours
		//          6. éventuellement stopper le setTimeout le cas échéant (!!)
		//          7. éventuellement stopper le setInterval le cas échéant (!!)
		//

		// FIXME : attention, l'annulation peut être automatique (délai dépassé) ou manuelle (même si à priori ce n'est pas demandé dans les specs)
	}



	/**
	 * Effectuer la réservation
	 *
	 * @private
	 */
	function _makeReservation()
	{


		//
		// FIXME : vérifier s'il y a déjà une réservation en cours, si oui l'annuler ! (après un confirm() bien sûr)
		//        (pour annuler une réservation : récupérer la station d'une manière ou d'une autre, et appeler cancelResa() dessus)
		//



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
		const res = _checkReservationInfo();
		if (!res)
		{
			console.error('Les infos de réservation ne sont pas bonnes, cela ne devrait pas arriver !');
			return;
		}



		//
		// FIXME : faire une tentative de réservation sur la station avec _currentStation.reserveBike();
		//        Si le résultat est false, c'est que la réservation a échoué !!
		//




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
		sessionStorage.setItem('reservation', JSON.stringify(_resa));

		// On enregistre le prénom et le nom pour plus tard (pas perdus si fermeture navigateur)
		localStorage.setItem('lastname', firstN);
		localStorage.setItem('firstname', lastN);

		// Les specs demandent d'enregistrer la signature en session
		sessionStorage.setItem('signature', _canvas.saveCanvas());

		// On déclenche le compte à rebours de la validité de la réservation...
		// FIXME : garder une référence au timeoutID retourné par setTimeout afin de pouvoir appeler clearTimeout
		//          si on annule la réservation !!
		setTimeout(_cancelReservation, DURATION * 1000);


		//
		// FIXME : afficher les détails de la réservation dans la DIV prévue à cet effet
		//


		//
		// FIXME : utiliser un setInterval() pour le compte à rebours
		//


		//
		// FIXME : repasser la zone de formulaire en "empty state" !!! (et remettre _currentStation à vide, etc.)
		//
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
		$('#btn-reserve', _$details).attr('disabled', !_checkReservationInfo());
	};

	/**
	 * Vérifie si les infos de la réservation sont valides. Si oui retourne le prénom et nom nettoyés, sinon retourne false.
	 *
	 * @returns {boolean|string[]}
	 *
	 * @private
	 */
	const _checkReservationInfo = () => {
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
			alert('Votre signature est trop petite');
		}

		// S'il y a un problème, on retourne false
		if (!ok)
			return false;

		// Sinon, on retourne le nom et le prénom
		return [firstN, lastN];
	};

	/**
	 * Vérifie si un nom est valide
	 *
	 * @param {string} name
	 *
	 * @returns {string|boolean}
	 *
	 * @private
	 */
	const _checkName = name => {
		// Première vérification basique...
		if (typeof name !== 'string' || !name)
			return false;

		/**
		 * Attention aux leading/trailing spaces, on utilise trim() pour les enlever
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
 		 */
		name = name.trim();

		//
		// FIXME : faire d'autres nettoyages, par exemple n'accepter que lettres, apostrophe, trait d'union, point, espace.
		//          utiliser pour cela une RegExp (@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
		// Par exemple (doit toujours commencer par une lettre) :
		//       /^[A-Za-z][A-Za-z\.'- ]+$/.test(name)
		//

		if (name.length < MIN_NAME_LENGTH)
			return false;

		//
		// FIXME : peut-être qu'on veut aussi transformer la première lettre de chaque mot en majuscule pour homogénéiser
		//          et faire joli ?
		//       @see https://stackoverflow.com/a/18546504 (attention cette solution ne gère pas les noms avec des espaces,
		//                                                  ça ne met que la 1ère lettre en majuscule c'est tout)
		//

		// Tout va bien, on retourne le nom "nettoyé"
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
		// FIXME : détecter s'il y a une réservation en session (et si toutes les données de session sont valides).
		//          Si oui, mettre à jour tout ce qu'il faut (zone HTML de détail de la réservation, setTimeout, setInterval, etc.
		//          SURTOUT (!!!) essayer de factoriser le code entre une réservation manuelle et une "réservation" ici.
		//
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
