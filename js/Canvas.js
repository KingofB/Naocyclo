/**
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
	let _bDrawing = false;

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
			e.preventDefault();
			e.stopPropagation();

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
		if (_bDrawing)
		{
			_bDrawing = false;
			_ctx.closePath();
			if (_isTouch)
				_canvas.removeEventListener('touchmove', _drawTouch);
			else
				_canvas.removeEventListener('mousemove', _draw);
		}
	}

	/**
	 * Commencer à dessiner
	 *
	 * @private
	 *
	 * @param {MouseEvent|TouchEvent} e
	 */
	function _beginDraw(e) {
		_isTouch = e.type == 'touchstart';

		if (!_bDrawing && ((_isTouch && e.touches.length > 0) || (!_isTouch && (e.buttons & 1))))
		{
			e.preventDefault();
			e.stopPropagation();

			// Mettre à jour le scale à chaque nouveau tracé
			// (normalement ça ne devrait pas changer, mais mieux vaut être + strict
			// et ne pas laisser de place à l'erreur)
			_canvasRect = _canvas.getBoundingClientRect();
			_scale.x = _canvas.width / _canvasRect.width;
			_scale.y = _canvas.height / _canvasRect.height;

			_bDrawing = true;
			_ctx.beginPath();
			_ctx.lineWidth = LINE_WIDTH;
			_ctx.strokeStyle = LINE_COLOR;

			// Utilisation du scale
			_ctx.moveTo((_isTouch ? e.touches[0].clientX - _canvasRect.left : e.offsetX) * _scale.x, (_isTouch ? e.touches[0].clientY - _canvasRect.top : e.offsetY) * _scale.y);
			if (_isTouch)
				_canvas.addEventListener('touchmove', _drawTouch);
			else
				_canvas.addEventListener('mousemove', _draw);
		}
	}

	/**
	 * Dessiner
	 *
	 * @private
	 *
	 * @param {MouseEvent} e
	 */
	function _draw(e)
	{
		if (!_bDrawing)
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
		if (!_bDrawing)
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

		const len = _signature.data.length;
		let i = 0, nb = 0, total = 0;

		// const t1 = performance.now();
		while (true)
		{
			if (_signature.data.slice(i, i + 4).reduce((r, c) => r + c, 0) > 0)
				nb++;
			total++;
			i += 4;
			if (i >= len)
				break;
		}
		// const t2 = performance.now();

		// console.warn('nb', nb, total, t2 - t1);

		if (total <= 0)
			return 0;

		return (nb / total) * 100;
	};

	/**
	 * Vider le contenu du canvas
	 *
	 * @public
	 */
	this.clear = function() {
		_ctx.clearRect(0, 0, _canvas.width, _canvas.height);
	};

	/**
	 * Sauvegarde la signature telle qu'elle est actuellement
	 *
	 * @public
	 */
	this.storeImage = () => {
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
		_canvas.addEventListener('touchstart', _beginDraw);//_touchDevice ? 'touchstart' : 'mousedown'
		_canvas.addEventListener('mousedown', _beginDraw);//_touchDevice ? 'touchstart' : 'mousedown'
		_canvas.addEventListener('touchend', _tryStopDraw);
		_canvas.addEventListener('touchcancel', _tryStopDraw);
		_canvas.addEventListener('mouseup', _tryStopDraw);

		// Peut-être que de continuer à dessiner si on sort du cadre et qu'on revient est une bonne idée en fait...
		// _canvas.addEventListener('mouseout', _stopDraw);
	}




	_init();
}
