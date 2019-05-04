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
	const canvas = document.querySelector('canvas');

	/**
	 * Le contexte de dessin (peut être 2D ou 3D, mais ici on utilisera la 2D)
	 *
	 * @private
	 *
	 * @type {CanvasRenderingContext2D | WebGLRenderingContext}
	 */
	const ctx = canvas.getContext('2d');

	/**
	 * Utilisé si jamais le canvas a un boundingClientRect différent de sa taille "pseudo-réelle"
	 *
	 * @private
	 *
	 * @type {{x: number, y: number}}
	 */
	const scale = {x: 1, y: 1};

	/**
	 * Est-on en train de dessiner ?
	 *
	 * @private
	 *
	 * @type {boolean}
	 */
	let bDrawing = false;

	/**
	 * La signature (format ImageData)
	 *
	 * @private
	 *
	 * @type {ImageData}
	 */
	let signature = null;




	/**
	 * Arrêter de dessiner
	 *
	 * @private
	 */
	function stopDraw()
	{
		if (bDrawing)
		{
			bDrawing = false;
			ctx.closePath();
			canvas.removeEventListener('mousemove', draw);
		}
	}

	/**
	 * Commencer à dessiner
	 *
	 * @private
	 *
	 * @param {MouseEvent} e
	 */
	function beginDraw(e) {
		if ((e.buttons & 1) && !bDrawing)
		{
			// Mettre à jour le scale à chaque nouveau tracé
			const rect = canvas.getBoundingClientRect();
			scale.x = canvas.width / rect.width;
			scale.y = canvas.height / rect.height;

			bDrawing = true;
			ctx.beginPath();
			ctx.lineWidth = LINE_WIDTH;
			ctx.strokeStyle = LINE_COLOR;

			// Utilisation du scale
			ctx.moveTo(e.offsetX * scale.x, e.offsetY * scale.y);
			canvas.addEventListener('mousemove', draw);
		}
	}

	/**
	 * Dessiner
	 *
	 * @private
	 *
	 * @param {MouseEvent} e
	 */
	function draw(e)
	{
		if (!bDrawing)
			return;

		if ((e.buttons & 1) == 0)
			return stopDraw();

		// Utilisation du scale
		ctx.lineTo(e.offsetX * scale.x, e.offsetY * scale.y);
		ctx.stroke();
	}

	/**
	 * Enregistrer le contenu du canvas
	 *
	 * @public
	 *
	 * @returns {string}
	 */
	this.saveCanvas = function() {
		return canvas.toDataURL();
	};

	/**
	 * Vider le contenu du canvas
	 *
	 * @public
	 */
	this.clear = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	/**
	 * Sauvegarde la signature telle qu'elle est actuellement
	 *
	 * @public
	 */
	this.storeImage = () => {
		signature = ctx.getImageData(0, 0, canvas.width, canvas.height);
	};

	/**
	 * Réinitialise la signature telle qu'elle était avant
	 *
	 * @public
	 */
	this.restoreImage = () => {
		ctx.putImageData(signature, 0, 0);
	};




	/**
	 * Initialiser ce module
	 *
	 * @private
	 */
	function init()
	{
		canvas.addEventListener('mousedown', beginDraw);
		canvas.addEventListener('mouseup', e => {
			// Le bouton principal est relâché, on arrête le dessin
			// Ici on utiliser un opérateur "ET binaire" (en anglais : "binary AND operator")
			if ((e.buttons & 1) == 0) {
				stopDraw();
			}
		});

		// Peut-être que de continuer à dessiner si on sort du cadre et qu'on revient est une bonne idée en fait...
		// canvas.addEventListener('mouseout', stopDraw);
	}




	init();
}
