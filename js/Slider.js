/*****************************************

 CARROUSEL

 *****************************************/



/*******************************************
 Fonction de changement de diapo
 ********************************************/

/**
 * Carrousel réutilisable
 *
 * @param {HTMLElement} container
 * @param {null | string | array} slides Null: ne fait rien. String: url d'un fichier JSON. Array: slides en JSON.
 *
 * @constructor
 */
export function Slider(container, slides)
{
	/**
	 * Variable JS de la div slider
	 *
	 * @private
	 *
	 * @type {HTMLElement}
	 */
	const _slider = container;

	/**
	 * Variable JS des divs enfants de la div slider
	 *
	 * @private
	 *
	 * @type {NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[string]> | null}
	 */
	let _slidesList = null;

	/**
	 * Variable du nombre de slides
	 *
	 * @private
	 *
	 * @type {number}
	 */
	let _nbSlides = 0;


	/**
	 * Variable jquery de la div slider
	 *
	 * @private
	 *
	 * @type {jQuery}
	 */
	const _$slider = $(_slider);

	/**
	 * Variable jquery de toutes les divs enfants de la div slider
	 *
	 * @private
	 *
	 * @type {jQuery|null}
	 */
	let _$slides = null;

	/**
	 * Variable jquery de toutes les li de navigation de la div slider
	 *
	 * @private
	 *
	 * @type {jQuery|null}
	 */
	let _$lis = null;


	/**
	 * Variable du timeout
	 *
	 * @private
	 *
	 * @type {number|null}
	 */
	let _timeoutId = null;

	/**
	 * Variable de la diapo actuelle
	 *
	 * @private
	 *
	 * @type {number}
	 */
	let _currentSlide = 0;




	/**
	 * Fonction principale de changement de slide :
	 *
	 * @private
	 *
	 * @param {number} slideIdx
	 */
	const _changeSlide = (slideIdx) => {
		if (_nbSlides <= 1)
			return;

		// Mise à jour du numéro de la slide actuelle
		_currentSlide = slideIdx;
		// Vérification des cas extrêmes
		if (_currentSlide < 0) {
			_currentSlide = _nbSlides - 1;
		} else if (_currentSlide >= _nbSlides) {
			_currentSlide = 0;
		}

		/**
		 * Ici attention : puisqu'on a choisi de ne pas attribuer une taille au slider lui-même,
		 * sa taille est donc définie par son contenu. Or, si on cache la slide courante avant d'afficher la suivante,
		 * le slide occupe alors 0px de hauteur, et cause un "saut" du scroll du body.
		 *
		 * Deux solutions donc :
		 * 1. D'abord afficher la prochaine slide, puis masquer l'ancienne
		 * 2. Donner une hauteur au slider (mais attention au redimensionnement etc.)
		 */
		// On récupère la slide sélectionnée par son index grâce à "eq"
		_$slides.eq(_currentSlide).show();
		// On cache toutes les slides
		_$slides.not(':eq(' + _currentSlide + ')').hide();
		// Changement du LI actif
		_$lis.removeClass('active').eq(_currentSlide).addClass('active');





		// Démarrage du diaporama auto :
		if (_$slider.hasClass('paused')) {
			_stopShow();
		}
		else {
			_startShow();
		}

		/**
		 * Pour faire le kéké, on pourrait écrire les lignes ci-dessus en "one-liner" de plusieurs manières :
		 *
		 * 1. toggleShow(_$slider.hasClass('paused')); // Il faudrait alors créer cette fonction (meilleure solution)
		 *
		 * 2. [_startShow, _stopShow][+_$slider.hasClass('paused')](); // Relativement illisible, mais correct
		 *
		 * 3. return _$slider.hasClass('paused') ? _stopShow() : _startShow(); // Solution intermédiaire
		 */
	};

	/**
	 * Fonction de changement vers le prochain slide
	 *
	 * @private
	 */
	const _nextSlide = () => {
		_changeSlide(_currentSlide + 1);
	};

	/**
	 * Fonction de changement vers la slide précédente
	 *
	 * @private
	 */
	const _prevSlide = () => {
		_changeSlide(_currentSlide - 1);
	};

	/**
	 * Fonction de démarrage du carrousel auto
	 *
	 * @private
	 */
	const _startShow = () => {
		if (_nbSlides <= 1)
			return;

		_stopShow();
		_timeoutId = setTimeout(_nextSlide, 5000);
	};

	/**
	 * Fonction de pause du carrousel auto
	 *
	 * @private
	 */
	const _stopShow = () => {
		clearTimeout(_timeoutId);
		_timeoutId = null;
	};

	/**
	 * Fonction ajustant la lecture ou la pause du carrousel en fonction de son état (sa classe "paused" ou pas)
	 *
	 * @private
	 */
	const playPause = () => {
		if (_nbSlides <= 1)
			return;

		_$slider.toggleClass('paused');
		if (_$slider.hasClass('paused')) {
			_stopShow();
		}
		else {
			_startShow();
		}
	};




	/**
	 * Démarrer le plugin avec les slides fournies en paramètre
	 *
	 * @private
	 *
	 * @param {Array} aSlides
	 */
	const _initSlides = aSlides => {
		// On remplit notre slider avec les slides générées.
		// Pour ce faire, on utilise Array.reduce, qui réduit tous les éléments d'un tableau en une seule valeur.
		_slider.innerHTML = (aSlides || []).reduce((result, current) => {
			return result + `
				<div>
					<h2>${current.title}</h2>

					<img srcset="${current.image.srcset}" src="${current.image.src}" alt="${current.image.alt}">

					<p>${current.description}</p>
				</div>`
		}, '');

		// On récupère la liste des slides pour plus tard
		_slidesList = _slider.querySelectorAll(':scope > div');

		// On compte le nombre de slides
		_nbSlides = _slidesList.length;

		// Même chose que "_slidesList", mais en jQuery...
		_$slides = _$slider.find('> div');

		// Création des boutons et LI de navigation
		if (_nbSlides > 1)
		{
			// Pas besoin de navigation si on a 1 ou 0 slides
			_slider.insertAdjacentHTML('afterbegin', `<span class="icomoon nav-prev"></span>
				<span class="icomoon nav-pause"></span>
				<span class="icomoon nav-next"></span>
				<ul>${'<li></li>'.repeat(_nbSlides)}</ul>`);
		}

		// On récupère les "puces" de navigation des slides
		_$lis = _$slider.find('ul li');

		// Attribution de la classe active au 1er LI de navigation
		_$lis.first().addClass('active');


		// Ajout des listeners
		$('body')
			// Changement de slide par la liste de boutons
			.on('click', '#slider li', e => _changeSlide(_$lis.index(e.currentTarget)))
			// Au clic sur nav-next, on affiche le slide suivant
			.on('click', '.nav-next', _nextSlide)
			// Au clic sur nav-prev, on affiche le slide précédent
			.on('click', '.nav-prev', _prevSlide)
			// Au clic sur bouton pause, on arrête le carousel auto
			.on('click', '.nav-pause', playPause)
			// Vérification que la cible est bien sur le body, et pas sur un input par exemple
			.on('keyup', e => {
				if (e.target != document.body) {
					return;
				}

				// Switch des différentes touches utilisées :
				switch (e.keyCode) {
					case 37:
						_prevSlide();
						break;

					case 39:
						_nextSlide();
						break;
				}
			})
			// Activation de la lecture ou de la pause du carrousel par la touche espace
			.on('keypress', e => {
				if (e.target != document.body) {
					return;
				}

				if (e.keyCode == 32) {
					playPause();
				}
			})
		;



		// Appel de la fonction de démarrage du carrousel auto
		_startShow();
	};

	/**
	 * Fonction gérant la navigation du carrousel avec les boutons ou les touches clavier
	 *
	 * @private
	 */
	const _init = () => {
		if (_$slider.length === 0)
		{
			console.warn('Impossible de trouver le conteneur pour afficher le carrousel : ', container);
			return;
		}

		/**
		 * Le paramètre "slides" est fourni à notre constructeur "Slider".
		 * Il peut être vide, ou bien une string (dans ce cas c'est l'URL d'un fichier JSON à récupérer),
		 * ou encore un tableau de slides "en dur".
		 */
		if (Array.isArray(slides))
		{
			// Cas le plus simple : on fournit en paramètre un tableau de slides...
			_initSlides(slides);
		}
		else if (typeof slides === 'string' && slides.length > 0)
		{
			// Ici "slides" est une string, c'est donc l'URL d'un fichier JSON qui contient les slides à importer.
			// On va utiliser l'API Fetch pour récupérer ce JSON.
			/** @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API */
			fetch(slides)
				.then(response => {
					// Fonction de callback appelée lorsque l'appel AJAX est terminé.
					// On vérifie que tout s'est bien passé.
					if (!response.ok)
						throw 'Impossible de charger les slides. Statut HTTP ' + response.status + ' (' + response.statusText + ')';

					// Si on arrive ici, alors tout s'est bien passé, et on retourne une Promise pour
					// transformer le corps de la réponse en objet JSON.
					return response.json();
				})
				.then(json => _initSlides(json)) // Si tout s'est bien passé, on peut initialiser notre module
				.catch(e => {
					// S'il y a une erreur, on l'affiche dans la console
					console.warn(e);
				})
			;
		}
		else
		{
			// Dans tous les autres cas, on initialise avec 0 slides
			_initSlides([]);
		}
	};



	// Appel de la fonction d'initialisation de la gestion de la navigation du carrousel
	_init();
}
