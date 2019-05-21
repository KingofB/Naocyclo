/**
 * Classe utilitaire pour gérer le canvas
 *
 * @param {HTMLCanvasElement} canvas
 *
 * @constructor
 */
export function Canvas(canvas)
{
	/**
	 * Epaisseur du trait de signature
	 *
	 * @private
	 *
	 * @type {number}
	 */
	const LINE_WIDTH = 1.5;

	/**
	 * Couleur du trait de signature
	 *
	 * @private
	 *
	 * @type {string}
	 */
	const LINE_COLOR = 'teal';

	/**
	 * Le canvas
	 *
	 * @private
	 *
	 * @type {HTMLCanvasElement}
	 */
	const _canvas = canvas;

	/**
	 * Le contexte de dessin (peut être 2D ou 3D, mais ici on utilisera la 2D)
	 *
	 * @private
	 *
	 * @type {CanvasRenderingContext2D | WebGLRenderingContext}
	 */
	const _ctx = _canvas.getContext('2d');

	/**
	 * Utilisé si jamais le canvas a un boundingClientRect différent de sa taille "pseudo-réelle"
	 * c'est-à-dire si jamais la zone de dessin du context a une dimension différente de celle du canvas
	 * afin de permettre de dessiner au bon endroit en appliquant le "_scale" aux positions des events.
	 *
	 * @private
	 *
	 * @type {{x: number, y: number}}
	 */
	const _scale = {x: 1, y: 1};

	/**
	 * Est-on en train de dessiner ?
	 *
	 * @private
	 *
	 * @type {boolean}
	 */
	let _isDrawing = false;

	/**
	 * La signature (format ImageData)
	 *
	 * @private
	 *
	 * @type {ImageData}
	 */
	let _signature = null;

	/**
	 * Dessine-t-on en mode tactile ?
	 *
	 * @type {boolean}
	 *
	 * @private
	 */
	let _isTouch = false;

	/**
	 * Surface de dessin
	 * TODO : amélioration possible : détecter le redimensionnement de la page, et mettre
	 * 			cette valeur à jour lors de cet event.
	 *
	 * @type {DOMRect | ClientRect}
	 *
	 * @private
	 */
	let _canvasRect = null;





	/**
	 * Callback quand on relâche la pression
	 *
	 * @param {MouseEvent|TouchEvent} e
	 *
	 * @private
	 */
	function _tryStopDraw(e)
	{
		// Le bouton principal est relâché, on arrête le dessin
		// Ici on utiliser un opérateur "ET binaire" (en anglais : "binary AND operator")
		if ((_isTouch && e.touches.length == 0) || (!_isTouch && (e.buttons & 1) == 0))
		{
			// On capture l'événement
			e.preventDefault();
			e.stopPropagation();

			// On stoppe le dessin
			_stopDraw();
		}
	}

	/**
	 * Arrêter de dessiner
	 *
	 * @private
	 */
	function _stopDraw()
	{
		if (!_isDrawing) return;

		_isDrawing = false;
		_ctx.closePath();

		if (_isTouch)
			_canvas.removeEventListener('touchmove', _drawTouch);
		else
			_canvas.removeEventListener('mousemove', _drawMouse);
	}

	/**
	 * Commencer à dessiner
	 *
	 * @private
	 *
	 * @param {MouseEvent|TouchEvent} e
	 */
	function _beginDraw(e) {
		if (_isDrawing) return;

		// _isTouch est égal à : oui ou non e.type est égal à 'touchstart' (résultat (boolean) de la comparaison entre les deux)
		// @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
		// @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
		_isTouch = e.type == 'touchstart';

		// @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches
		// @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
		// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
		// e.buttons contient la sommes des puissances de 2 qui représentent chaque bouton (ex: bouton1 = 1 et bouton3 = 4)
		if ((_isTouch && e.touches.length > 0) || (!_isTouch && (e.buttons & 1)))
		{
			e.preventDefault();
			e.stopPropagation();

			// Variable pour récupérer la taille de la zone de dessin du canvas
			_canvasRect = _canvas.getBoundingClientRect();
			// Mise à jour de l'echelle x-y sur la zone de dessin et sur le canvas
			_scale.x = _canvas.width / _canvasRect.width;
			_scale.y = _canvas.height / _canvasRect.height;

			_isDrawing = true;
			_ctx.beginPath();
			_ctx.lineWidth = LINE_WIDTH;
			_ctx.strokeStyle = LINE_COLOR;

			// Utilisation du scale pour transformer les coordonnées de la position sur le canvas (récupérées via l'event "e")
			// en coordonnées sur la zone de dessin (qui n'a pas forcément la même taille que le canvas, d'où le scale).
			_ctx.moveTo((_isTouch ? e.touches[0].clientX - _canvasRect.left : e.offsetX) * _scale.x, (_isTouch ? e.touches[0].clientY - _canvasRect.top : e.offsetY) * _scale.y);

			if (_isTouch)
				_canvas.addEventListener('touchmove', _drawTouch);
			else
				_canvas.addEventListener('mousemove', _drawMouse);
		}
	}

	/**
	 * Dessiner (souris)
	 *
	 * @private
	 *
	 * @param {MouseEvent} e
	 */
	function _drawMouse(e)
	{
		if (!_isDrawing)
			return;

		e.preventDefault();
		e.stopPropagation();

		if ((e.buttons & 1) == 0)
			return _stopDraw();

		_actualDraw(e.offsetX, e.offsetY);
	}

	/**
	 * Dessiner (tactile)
	 *
	 * @private
	 *
	 * @param {TouchEvent} e
	 */
	function _drawTouch(e)
	{
		if (!_isDrawing)
			return;

		e.preventDefault();
		e.stopPropagation();

		if (e.touches.length == 0)
			return _stopDraw();

		_actualDraw(e.touches[0].clientX - _canvasRect.left, e.touches[0].clientY - _canvasRect.top);
	}

	/**
	 * Fonction de dessin aux coordonnées choisies
	 *
	 * @param {number} x
	 * @param {number} y
	 *
	 * @private
	 */
	function _actualDraw(x, y)
	{
		// Utilisation du scale
		_ctx.lineTo(x * _scale.x, y * _scale.y);
		_ctx.stroke();
	}

	/**
	 * Enregistrer le contenu du canvas
	 *
	 * @public
	 *
	 * @returns {string}
	 */
	this.saveCanvas = function() {
		return _canvas.toDataURL();
	};

	/**
	 * Récupère le pourcentage de remplissage de l'image
	 *
	 * @public
	 *
	 * @returns {number}
	 */
	this.getImageFilledPercent = function()
	{
		if (!_signature) return 0;

		// _signature.data contient tous les pixels de la zone de dessin.
		// Un pixel est représenté par 4 valeurs : RGBA (chaque valeur vaut de 0 à 255).
		// Donc une zone de dessin de 100x50 contiendra 5.000 pixels, et donc 20.000 valeurs dans _signature.data.
		const len = _signature.data.length;
		// On définit 4 variables dans la même instruction.
		let i = 0, nbColoredPixels = 0, nbPixels = len / 4, rgba = [];

		if (nbPixels <= 0)
			return 0;

		// const t1 = performance.now();
		while (true)
		{
			// TODO Le code pourrait être amélioré ici :
			//		==> Si l'alpha est complètement transparent (4ème valeur du sous-tableau = 0), il ne faut pas prendre en compte ce pixel.
			//		==> Si c'est du blanc (peu importe l'opacité) ==> on ne prend pas ce pixel en compte
			// Noir opaque 100% :
			// [0, 0, 0, 255]
			// Rouge opaque 100% :
			// [255, 0, 0, 255]
			// Blanc (peu importe l'opacité) :
			// [255, 255, 255, ???]
			rgba = _signature.data.slice(i, i + 4);
			if ((rgba[3] > 0) && (rgba[0] + rgba[1] + rgba[2] < 765)) {
				nbColoredPixels++;
			}

			i += 4;

			if (i >= len)
				break;
		}
		// const t2 = performance.now();

		// console.warn('nb', nb, total, t2 - t1);

		// Retourne le pourcentage de pixels colorés sur la zone de dessin
		return (nbColoredPixels / nbPixels) * 100;
	};

	/**
	 * Vider le contenu du canvas
	 *
	 * @public
	 */
	this.clear = function() {
		// FIXME : vérifier s'il faut utiliser le "_scale" ici
		_ctx.clearRect(0, 0, _canvas.width, _canvas.height);
	};

	/**
	 * Sauvegarde la signature telle qu'elle est actuellement
	 *
	 * @public
	 */
	this.storeImage = () => {
		// FIXME : vérifier s'il faut utiliser le "_scale" ici
		_signature = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
	};

	/**
	 * Réinitialise la signature telle qu'elle était avant
	 *
	 * @public
	 */
	this.restoreImage = () => {
		_ctx.putImageData(_signature, 0, 0);
	};




	/**
	 * Initialiser ce module
	 *
	 * @private
	 */
	function _init()
	{
		// Listeners tactiles
		_canvas.addEventListener('touchstart', _beginDraw);
		_canvas.addEventListener('touchend', _tryStopDraw);
		_canvas.addEventListener('touchcancel', _tryStopDraw);

		// Listeners souris
		_canvas.addEventListener('mousedown', _beginDraw);
		_canvas.addEventListener('mouseup', _tryStopDraw);
	}


	_init();
}
