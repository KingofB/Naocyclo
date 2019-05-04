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
	const slider = container;

	/**
	 * Variable JS des divs enfants de la div slider
	 *
	 * @private
	 *
	 * @type {NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[string]> | null}
	 */
	let slidesList = null;

	/**
	 * Variable du nombre de slides
	 *
	 * @private
	 *
	 * @type {number}
	 */
	let nbSlides = 0;


	/**
	 * Variable jquery de la div slider
	 *
	 * @private
	 *
	 * @type {jQuery}
	 */
	const $slider = $(slider);

	/**
	 * Variable jquery de toutes les divs enfants de la div slider
	 *
	 * @private
	 *
	 * @type {jQuery|null}
	 */
	let $slides = null;

	/**
	 * Variable jquery de toutes les li de navigation de la div slider
	 *
	 * @private
	 *
	 * @type {jQuery|null}
	 */
	let $lis = null;


	/**
	 * Variable du timeout
	 *
	 * @private
	 *
	 * @type {number|null}
	 */
	let timeoutId = null;

	/**
	 * Variable de la diapo actuelle
	 *
	 * @private
	 *
	 * @type {number}
	 */
	let currentSlide = 0;




	/**
	 * Fonction principale de changement de slide :
	 *
	 * @private
	 *
	 * @param {number} slideIdx
	 */
	const changeSlide = (slideIdx) => {
		if (nbSlides <= 1)
			return;

		// Mise à jour du numéro de la slide actuelle
		currentSlide = slideIdx;
		// Vérification des cas extrêmes
		if (currentSlide < 0) {
			currentSlide = nbSlides - 1;
		} else if (currentSlide >= nbSlides) {
			currentSlide = 0;
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
		$slides.eq(currentSlide).show();
		// On cache toutes les slides
		$slides.not(':eq(' + currentSlide + ')').hide();
		// Changement du LI actif
		$lis.removeClass('active').eq(currentSlide).addClass('active');





		// Démarrage du diaporama auto :
		if ($slider.hasClass('paused')) {
			stopShow();
		}
		else {
			startShow();
		}

		/**
		 * Pour faire le kéké, on pourrait écrire les lignes ci-dessus en "one-liner" de plusieurs manières :
		 *
		 * 1. toggleShow($slider.hasClass('paused')); // Il faudrait alors créer cette fonction (meilleure solution)
		 *
		 * 2. [startShow, stopShow][+$slider.hasClass('paused')](); // Relativement illisible, mais correct
		 *
		 * 3. return $slider.hasClass('paused') ? stopShow() : startShow(); // Solution intermédiaire
		 */
	};

	/**
	 * Fonction de changement vers le prochain slide
	 *
	 * @private
	 */
	const nextSlide = () => {
		changeSlide(currentSlide + 1);
	};

	/**
	 * Fonction de changement vers la slide précédente
	 *
	 * @private
	 */
	const prevSlide = () => {
		changeSlide(currentSlide - 1);
	};

	/**
	 * Fonction de démarrage du carrousel auto
	 *
	 * @private
	 */
	const startShow = () => {
		if (nbSlides <= 1)
			return;

		stopShow();
		timeoutId = setTimeout(nextSlide, 5000);
	};

	/**
	 * Fonction de pause du carrousel auto
	 *
	 * @private
	 */
	const stopShow = () => {
		clearTimeout(timeoutId);
		timeoutId = null;
	};

	/**
	 * Fonction ajustant la lecture ou la pause du carrousel en fonction de son état (sa classe "paused" ou pas)
	 *
	 * @private
	 */
	const playPause = () => {
		if (nbSlides <= 1)
			return;

		$slider.toggleClass('paused');
		if ($slider.hasClass('paused')) {
			stopShow();
		}
		else {
			startShow();
		}
	};




	/**
	 * Démarrer le plugin avec les slides fournies en paramètre
	 *
	 * @private
	 *
	 * @param {Array} aSlides
	 */
	const initSlides = aSlides => {
		// On remplit notre slider avec les slides générées.
		// Pour ce faire, on utilise Array.reduce, qui réduit tous les éléments d'un tableau en une seule valeur.
		slider.innerHTML = (aSlides || []).reduce((result, current) => {
			return result + `
				<div>
					<h2>${current.title}</h2>

					<img srcset="${current.image.srcset}" src="${current.image.src}" alt="${current.image.alt}">

					<p>${current.description}</p>
				</div>`
		}, '');

		// On récupère la liste des slides pour plus tard
		slidesList = slider.querySelectorAll(':scope > div');

		// On compte le nombre de slides
		nbSlides = slidesList.length;

		// Même chose que "slidesList", mais en jQuery...
		$slides = $slider.find('> div');

		// Création des boutons et LI de navigation
		if (nbSlides > 1)
		{
			// Pas besoin de navigation si on a 1 ou 0 slides
			slider.insertAdjacentHTML('afterbegin', `<span class="icomoon nav-prev"></span>
				<span class="icomoon nav-pause"></span>
				<span class="icomoon nav-next"></span>
				<ul>${'<li></li>'.repeat(nbSlides)}</ul>`);
		}

		// On récupère les "puces" de navigation des slides
		$lis = $slider.find('ul li');

		// Attribution de la classe active au 1er LI de navigation
		$lis.first().addClass('active');


		// Ajout des listeners
		$('body')
			// Changement de slide par la liste de boutons
			.on('click', '#slider li', e => changeSlide($lis.index(e.currentTarget)))
			// Au clic sur nav-next, on affiche le slide suivant
			.on('click', '.nav-next', nextSlide)
			// Au clic sur nav-prev, on affiche le slide précédent
			.on('click', '.nav-nav-prev', prevSlide)
			// Au clic sur bouton pause, on arrête le carousel auto
			.on('click', '.nav-nav-pause', playPause)
			// Vérification que la cible est bien sur le body, et pas sur un input par exemple
			.on('keyup', e => {
				if (e.target != document.body) {
					return;
				}

				// Switch des différentes touches utilisées :
				switch (e.keyCode) {
					case 37:
						prevSlide();
						break;

					case 39:
						nextSlide();
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
		startShow();
	};

	/**
	 * Fonction gérant la navigation du carrousel avec les boutons ou les touches clavier
	 *
	 * @private
	 */
	const init = () => {
		if ($slider.length === 0)
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
			initSlides(slides);
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
				.then(json => initSlides(json)) // Si tout s'est bien passé, on peut initialiser notre module
				.catch(e => {
					// S'il y a une erreur, on l'affiche dans la console
					console.warn(e);
				})
			;
		}
		else
		{
			// Dans tous les autres cas, on initialise avec 0 slides
			initSlides([]);
		}
	};



	// Appel de la fonction d'initialisation de la gestion de la navigation du carrousel
	init();
}
