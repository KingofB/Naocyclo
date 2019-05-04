export function Canvas()
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
	const _canvas = document.querySelector('canvas');

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
			_canvas.removeEventListener('mousemove', _draw);
		}
	}

	/**
	 * Commencer à dessiner
	 *
	 * @private
	 *
	 * @param {MouseEvent} e
	 */
	function _beginDraw(e) {
		if ((e.buttons & 1) && !_bDrawing)
		{
			// Mettre à jour le scale à chaque nouveau tracé
			const rect = _canvas.getBoundingClientRect();
			_scale.x = _canvas.width / rect.width;
			_scale.y = _canvas.height / rect.height;

			_bDrawing = true;
			_ctx.beginPath();
			_ctx.lineWidth = LINE_WIDTH;
			_ctx.strokeStyle = LINE_COLOR;

			// Utilisation du scale
			_ctx.moveTo(e.offsetX * _scale.x, e.offsetY * _scale.y);
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

		if ((e.buttons & 1) == 0)
			return _stopDraw();

		// Utilisation du scale
		_ctx.lineTo(e.offsetX * _scale.x, e.offsetY * _scale.y);
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
		_canvas.addEventListener('mousedown', _beginDraw);
		_canvas.addEventListener('mouseup', e => {
			// Le bouton principal est relâché, on arrête le dessin
			// Ici on utiliser un opérateur "ET binaire" (en anglais : "binary AND operator")
			if ((e.buttons & 1) == 0)
				_stopDraw();
		});

		// Peut-être que de continuer à dessiner si on sort du cadre et qu'on revient est une bonne idée en fait...
		// _canvas.addEventListener('mouseout', _stopDraw);
	}




	_init();
}
